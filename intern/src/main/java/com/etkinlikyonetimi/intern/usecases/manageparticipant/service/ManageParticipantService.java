package com.etkinlikyonetimi.intern.usecases.manageparticipant.service;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Question;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.*;
import com.etkinlikyonetimi.intern.usecases.common.exception.QuotaIsFullException;
import com.etkinlikyonetimi.intern.usecases.common.exception.SameTCIDException;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.repository.AnswerRepository;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.repository.LotsRepository;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.repository.ParticipantRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.ApplicationRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.EventRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.QuestionRepository;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.repository.QuestionAskedByParticipantRepository;
import com.etkinlikyonetimi.intern.usecases.managesurvey.repository.SurveyAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.mail.MessagingException;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManageParticipantService {

    private final AnswerRepository answerRepository;
    private final ParticipantRepository participantRepository;
    private final EventRepository eventRepository;
    private final QuestionRepository questionRepository;
    private final MailSenderService mailSenderService;
    private final ApplicationRepository applicationRepository;
    private final LotsRepository lotsRepository;
    private final QuestionAskedByParticipantRepository questionAskedByParticipantRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;

    @Transactional
    public BufferedImage assign(Participant participantFromRequest, String eventUniqueName, List<Answer> answerList) throws Exception {
        Optional<Event> event = eventRepository.findByUniqueName(eventUniqueName);

        if(!checkIfParticipantNotAssignSameEvent(participantFromRequest, event.get()))
            throw new SameTCIDException("Bir etkinliğe birden fazla aynı TC Kimlik numarası ile başvuramazsınız!", 500);

        participantFromRequest.getAnswerSet().clear();
        Participant participant = setIfParticipantIsNotExist(participantFromRequest);
        event.get().setQuota(event.get().getQuota()-1);

        if(event.get().getQuota()<0)
            throw new QuotaIsFullException("Bu etkinliğin kotası dolmuştur!", 500);

        // Add participant to application table
        Application application = new Application(event.get(),participant);
        applicationRepository.save(application);

        eventRepository.save(event.get());
        saveAnswerBySettingQuestionAndOfAnswersOfParticipants(participant, event.get(),answerList);

        // QR CODE CREATION START//
        BufferedImage bufferedImage = createQrCode(participant,eventUniqueName);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage , "png", byteArrayOutputStream);
        // byte[] imageInByte = byteArrayOutputStream.toByteArray();
        return bufferedImage;
    }
    @Transactional
    public Participant setIfParticipantIsNotExist(Participant participantFromRequest){
        Optional<Participant> participantFromDB = participantRepository.findParticipantBySsn(participantFromRequest.getSsn());
        return participantFromDB.orElseGet(() -> participantRepository.save(participantFromRequest));
    }

    private boolean checkIfParticipantNotAssignSameEvent(Participant participant, Event event){
        Optional<Participant> participantFromDB = participantRepository.findParticipantBySsn(participant.getSsn());
        return participantFromDB.map(value -> value.getAppliedEvents()
                .stream().noneMatch(application -> application.getEvent().getUniqueName()
                        .equals(event.getUniqueName()))).orElse(true);
    }

    @Transactional
    public void saveAnswerBySettingQuestionAndOfAnswersOfParticipants(Participant participant, Event event, List<Answer> answers){

        answers.forEach(answer ->{
            Optional<Question> questionFromDB = questionRepository.findByEventAndContent(event, answer.getQuestion().getContent());
            if(questionFromDB.isPresent()){
                answer.setQuestion(questionFromDB.get());
                answer.setParticipant(participant);
                answerRepository.save(answer);
            }
        });

    }

    public BufferedImage createQrCode(Participant participant, String eventUniqueName) throws Exception {
        Optional<Event> event = eventRepository.findByUniqueName(eventUniqueName);
        if(event.isPresent()) {
            String qrContent = createQrCodeContent(event.get(), participant);
            BufferedImage bufferedImage = QrCodeGeneratorService.generateQRCodeImage(qrContent);
            String fileName = "./src/main/resources/static/qrcodes/" + participant.getMail() + eventUniqueName + ".png";
            saveImageAsPng(bufferedImage, fileName);
            sendMail(fileName,
                    participant.getMail(),
                    "Katıldığınız "+ event.get().getTitle()+" etkinliği hakkında",
                    "Bu QR kodu telefondan okutarak kayit bilgilerine erisebilirsiniz.");
            return bufferedImage;
        }
        else return null;
    }
    public String createQrCodeContent(Event event, Participant participant){
        String content = "****KATILIMCI BİLGİLERİ****"+"\n";
        content += "-Katılımcı TC Kimlik numarası: " + participant.getSsn()+"\n";
        content += "-Katılımcı Adı: " + participant.getName()+"\n";
        content += "-Katılımcı Soyadı: " + participant.getSurname()+"\n";
        content += "-Katılımcı Emaili: " + participant.getMail()+"\n\n";
        content += "****ETKİNLİK BİLGİLERİ****"+"\n";
        content += "-Etkinlik ID: " + event.getUniqueName()+"\n";
        content += "-Etkinlik Başlığı: " + event.getTitle()+"\n";
        content += "-Etkinlik Başlama Zamanı: " + event.getStartDateTime()+"\n";
        content += "-Etkinlik Bitiş Zamanı: " + event.getEndDateTime()+"\n";
        content += "-Etkinlik Adresi: " + event.getAddress()+"\n";
        content += "-Etkinlik Detayları: " + event.getNotes()+"\n";
        Locale trlocale= new Locale("tr", "TR");
        return String.format(trlocale, "%s",content);
    }

    public void saveImageAsPng(BufferedImage bufferedImage, String fileName){
        try {
            // retrieve image
            File outputfile = new File(fileName);
            ImageIO.write(bufferedImage, "png", outputfile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public Lots drawingLots(Lots lots, String eventUniqueName) throws IOException, MessagingException {
        Optional<Participant> participantFromDB = participantRepository.findParticipantBySsn(lots.getParticipant().getSsn());
        Optional<Event> eventFromDB = eventRepository.findByUniqueName(eventUniqueName);
        if(participantFromDB.isPresent() && eventFromDB.isPresent()){
            if(!checkIfParticipantNotAssignSameEvent(participantFromDB.get(), eventFromDB.get())){
                lots.setParticipant(participantFromDB.get());
                lots.setEvent(eventFromDB.get());
                final Lots lotsFromDatabase = lotsRepository.save(lots);
                String contentOfMail = lots.getParticipant().getSsn()
                        + " TC Kimlik no.su ile katıldigin "+lots.getEvent().getTitle().toLowerCase(new Locale("tr", "TR"))
                        +" etkinligi cekilisinde "+ lots.getGiftMessage().toLowerCase()+" kazandin!";

                String pathOfCongratImage = createCongratImage(lotsFromDatabase);
                sendMail(pathOfCongratImage,
                        participantFromDB.get().getMail(),
                        "Katıldığınız "+ eventFromDB.get().getTitle()+" etkinliği hakkında",
                        contentOfMail);
                return lotsFromDatabase;
            }else{
                throw new EntityNotFoundException();
            }
        }else{
            throw new EntityNotFoundException();
        }

    }

    public String createCongratImage(Lots lots) throws IOException {

        BufferedImage bufferedImage = null;
        try {
            File imageFile = new File("./src/main/resources/static/congratmultimedia/template.png");
            InputStream inputStream = new FileInputStream(imageFile);
            bufferedImage = ImageIO.read(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }


        String content = lots.getParticipant().getSsn() + " TC Kimlik no.su ile katıldığın "+lots.getEvent().getTitle();
        String content2 =" etkinliği çekilişinde "+ lots.getGiftMessage().toLowerCase()+" kazandın!";
        String congrat = "Tebrikler "+ lots.getParticipant().getName() +" "+lots.getParticipant().getSurname() +"!";
        String title = "Etkinlik Yönetim Sistemi";

        assert bufferedImage != null;
        Graphics graphics = bufferedImage.getGraphics();
        graphics.setColor(Color.BLACK);
        graphics.setFont(new Font("Serif", Font.ITALIC, 50));
        graphics.drawString(congrat, 540, 460);
        graphics.drawString(content, 240, 540);
        graphics.drawString(content2, 240, 600);
        // graphics.drawString(string, 440, 520);
        ImageIO.write(bufferedImage, "png", new File(
                "./src/main/resources/static/congratmultimedia/"+lots.getId()+".png"));
        return "./src/main/resources/static/congratmultimedia/"+lots.getId()+".png";
    }

    public void sendMail(String fileName, String email, String subject, String content) throws IOException, MessagingException {
        Locale trlocale= new Locale("tr", "TR");
        mailSenderService.sendmail("etkinlikyonetimi1234@gmail.com",
                email,
                String.format(trlocale, "%s",content),
                String.format(trlocale, "%s",subject),
                fileName
        );
    }

    public List<Application> getAppliedEventsBySSN(Participant participant) {
        Optional<Participant> participantFromDatabase = participantRepository.findParticipantBySsn(participant.getSsn());

        if(participantFromDatabase.isPresent())
            return getEventsNotAnsweredItsSurveyByParticipant(participantFromDatabase.get().getAppliedEvents());
        else
            throw new EntityNotFoundException();
    }

    private List<Application> getEventsNotAnsweredItsSurveyByParticipant(Set<Application> appliedEvents) {

        return appliedEvents
                .stream()
                .filter(
                        application-> application
                                .getParticipant()
                                .getSurveyAnswerSet()
                                .stream().noneMatch(surveyAnswer -> surveyAnswer
                                        .getSurveyQuestion()
                                        .getEvent()
                                        .getId().equals(application.getEvent().getId()))
                )
                .collect(Collectors.toList());
    }



    @Transactional
    public void addQuestionAskedByParticipant(List<QuestionAskedByParticipant> questionsAskedByParticipant, String eventUniqueName) {
        Optional<Event> eventFromDB = eventRepository.findByUniqueName(eventUniqueName);
        Optional<Participant> participantFromDB =
                participantRepository.findParticipantBySsn(questionsAskedByParticipant.get(0).getParticipant().getSsn());

        if(participantFromDB.isPresent() && eventFromDB.isPresent()
                && eventFromDB.get().getStartDateTime().isBefore(LocalDateTime.now())
                && eventFromDB.get().getEndDateTime().isAfter(LocalDateTime.now())){
            if(!checkIfParticipantNotAssignSameEvent(participantFromDB.get(), eventFromDB.get())){
                questionsAskedByParticipant.forEach(questions->{
                    questions.setParticipant(participantFromDB.get());
                    questions.setEvent(eventFromDB.get());
                    questionAskedByParticipantRepository.save(questions);
                });
            }else{
                throw new EntityNotFoundException();
            }
        }else{
            throw new EntityNotFoundException();
        }
    }
    @Transactional
    public Event deleteApplication(String ssn, String eventUniqueName) {
        Optional<Event> eventFromDB = eventRepository.findByUniqueName(eventUniqueName);
        Optional<Participant> participantFromDB =
                participantRepository.findParticipantBySsn(ssn);
        if(participantFromDB.isPresent() && eventFromDB.isPresent()){
            applicationRepository.deleteByParticipantAndEvent(participantFromDB.get(), eventFromDB.get());
            deleteDeletedParticipantsRowsFromAnswerTables(participantFromDB.get(),eventFromDB.get());
            Optional<Event> updatedEvent = eventRepository.findByUniqueName(eventFromDB.get().getUniqueName());
            updatedEvent.get().setQuota(updatedEvent.get().getQuota()+1);
            return eventRepository.save(updatedEvent.get());
        }else{
            throw new EntityNotFoundException();
        }
    }

    @Transactional
    public void deleteDeletedParticipantsRowsFromAnswerTables(Participant participant, Event event) {
        event.getQuestionSet().forEach(
                question ->
                        answerRepository.deleteAllByParticipantAndQuestion(
                                participant, question
                        )
        );
    }


    public Participant updateParticipant(Participant participantFromRequest) {
        Optional<Participant> participantFromDatabase =
                participantRepository.findParticipantBySsn(participantFromRequest.getSsn());

        if(participantFromDatabase.isPresent()){
            updateParticipantFields(participantFromRequest, participantFromDatabase.get());
            return participantRepository.save(participantFromDatabase.get());
        }else{
            throw new EntityNotFoundException();
        }
    }
    private void updateParticipantFields(Participant participantFromRequest,
                                         Participant participantFromDatabase){
        participantFromDatabase.setName(participantFromRequest.getName());
        participantFromDatabase.setSurname(participantFromRequest.getSurname());
        participantFromDatabase.setMail(participantFromRequest.getMail());
    }
}
