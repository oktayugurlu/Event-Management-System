package com.etkinlikyonetimi.intern.usecases.assignevent.service;

import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Answer;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.assignevent.exception.QuotaIsFullException;
import com.etkinlikyonetimi.intern.usecases.assignevent.exception.SameTCIDException;
import com.etkinlikyonetimi.intern.usecases.assignevent.repository.AnswerRepository;
import com.etkinlikyonetimi.intern.usecases.assignevent.repository.ParticipantRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Question;
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

    @Transactional
    public BufferedImage assign(Participant participantFromRequest, String eventUniqueName, List<Answer> answerList) throws Exception {
        Optional<Event> event = eventRepository.findByUniqueName(eventUniqueName);
        if(!checkIfParticipantNotAssignSameEvent(participantFromRequest, event.get()))
            throw new SameTCIDException("Bir etkinliğe birden fazla aynı TC Kimlik numarası ile başvuramazsınız!", 500);

        participantFromRequest.getAnswerSet().clear();
        Participant participant = setIfParticipantIsNotExist(participantFromRequest);

        if(!event.get().getAppliedParticipantSet().isEmpty()){
            Set<Participant> appliedParticipants = new java.util.HashSet<>(event.get().getAppliedParticipantSet());
            appliedParticipants.add(participant);
            event.get().setAppliedParticipantSet(appliedParticipants);
        }
        else{
            Set<Participant> participantSet = new HashSet<>();
            participantSet.add(participant);
            event.get().setAppliedParticipantSet(participantSet);
        }
        event.get().setQuota(event.get().getQuota()-1);
        if(event.get().getQuota()<0)
            throw new QuotaIsFullException("Bu etkinliğin kotası dolmuştur!", 500);
        eventRepository.save(event.get());
        saveAnswerBySettingQuestionAndOfAnswersOfParticipants(participant, event.get(),answerList);

        // QR CODE CREATION START//
        BufferedImage bufferedImage = createQrCode(participant.getMail(),eventUniqueName);
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
                .stream().noneMatch(appliedEvent -> appliedEvent.getUniqueName()
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

    public List<Answer> findAnswerByQuestionAndParticipant(Question question, Participant participant){
        return answerRepository.findByQuestionAndParticipant(question, participant);
    }

    public BufferedImage createQrCode(String mail, String eventUniqueName) throws Exception {
        Optional<Event> event = eventRepository.findByUniqueName(eventUniqueName);
        Optional<Participant> participant = participantRepository.findParticipantByMail(mail);
        if(participant.isPresent() && event.isPresent()) {
            String qrContent = createQrCodeContent(event.get(), participant.get());
            BufferedImage bufferedImage = QrCodeGeneratorService.generateQRCodeImage(qrContent);
            String fileName = "./src/main/resources/static/qrcodes/" + mail + eventUniqueName + ".png";
            saveImageAsPng(bufferedImage, fileName);
            sendMail(fileName, mail, event.get().getTitle());
            return bufferedImage;
        }
        else return null;
    }
    public String createQrCodeContent(Event event, Participant participant){
        String content = "****KATILIMCI BILGILERI****"+"\n";
        content += "-Katilimci TC Kimlik numarasi: " + participant.getSsn()+"\n";
        content += "Katilimcı Adi: " + participant.getName()+"\n";
        content += "Katilimci Soyadi: " + participant.getSurname()+"\n";
        content += "Katılımcı Emaili: " + participant.getMail()+"\n\n";
        content += "****ETKINLIK BILGILERI****"+"\n";
        content += "Etkinlik ID: " + event.getUniqueName()+"\n";
        content += "Etkinlik Basligi: " + event.getTitle()+"\n";
        content += "Etkinlik Baslama Zamani: " + event.getStartDateTime()+"\n";
        content += "Etkinlik Bitis Zamani: " + event.getEndDateTime()+"\n";
        content += "Etkinlik Adresi: " + event.getAddress()+"\n";
        content += "Etkinlik Detaylari: " + event.getNotes()+"\n";
        return content;
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
        mailSenderService.sendmail("etkinlikyonetimi1234@gmail.com",
                email,
                "Bu QR kodu telefondan okutarak kayıt bilgilerine erişebilirsiniz.",
                "Katıldğınız "+eventTitle+" etkinliği hakkında",
                fileName
        );
    }
}
