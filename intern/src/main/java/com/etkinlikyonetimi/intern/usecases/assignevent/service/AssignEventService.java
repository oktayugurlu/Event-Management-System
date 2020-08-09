package com.etkinlikyonetimi.intern.usecases.assignevent.service;

import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Answer;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.common.exception.QuotaIsFullException;
import com.etkinlikyonetimi.intern.usecases.common.exception.SameTCIDException;
import com.etkinlikyonetimi.intern.usecases.assignevent.repository.AnswerRepository;
import com.etkinlikyonetimi.intern.usecases.assignevent.repository.ParticipantRepository;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Application;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.ApplicationRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.EventRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AssignEventService {

    private final AnswerRepository answerRepository;
    private final ParticipantRepository participantRepository;
    private final EventRepository eventRepository;
    private final QuestionRepository questionRepository;
    private final MailSenderService mailSenderService;
    private final ApplicationRepository applicationRepository;

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
        byte[] imageInByte = byteArrayOutputStream.toByteArray();
        return bufferedImage;
    }
    private Participant setIfParticipantIsNotExist(Participant participantFromRequest){
        Optional<Participant> participantFromDB = participantRepository.findParticipantBySsn(participantFromRequest.getSsn());
        return participantFromDB.orElseGet(() -> participantRepository.save(participantFromRequest));
    }

    private boolean checkIfParticipantNotAssignSameEvent(Participant participant, Event event){
        Optional<Participant> participantFromDB = participantRepository.findParticipantBySsn(participant.getSsn());
        return participantFromDB.map(value -> value.getAppliedEvents()
                .stream().noneMatch(application -> application.getEvent().getUniqueName()
                        .equals(event.getUniqueName()))).orElse(true);
    }
    private void saveAnswerBySettingQuestionAndOfAnswersOfParticipants(Participant participant, Event event, List<Answer> answers){

        answers.forEach(answer ->{
            answer.setQuestion(questionRepository
                    .findByEventAndContent(event, answer.getQuestion().getContent()));
            answer.setParticipant(participant);
            answerRepository.save(answer);
        });

    }

    public BufferedImage createQrCode(Participant participant, String eventUniqueName) throws Exception {
        Optional<Event> event = eventRepository.findByUniqueName(eventUniqueName);
        if(event.isPresent()) {
            String qrContent = createQrCodeContent(event.get(), participant);
            BufferedImage bufferedImage = QrCodeGeneratorService.generateQRCodeImage(qrContent);
            String fileName = "./src/main/resources/static/qrcodes/" + participant.getMail() + eventUniqueName + ".png";
            saveImageAsPng(bufferedImage, fileName);
            sendMail(fileName, participant.getMail(), event.get().getTitle());
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

    public void sendMail(String fileName, String email, String eventTitle) throws IOException, MessagingException {
        Locale trlocale= new Locale("tr", "TR");
        String subject = "Katıldığınız "+eventTitle+" etkinliği hakkında";
        String content = "Bu QR kodu telefondan okutarak kayit bilgilerine erisebilirsiniz.";
        mailSenderService.sendmail("etkinlikyonetimi1234@gmail.com",
                email,
                String.format(trlocale, "%s",content),
                String.format(trlocale, "%s",subject),
                fileName
        );
    }
}
