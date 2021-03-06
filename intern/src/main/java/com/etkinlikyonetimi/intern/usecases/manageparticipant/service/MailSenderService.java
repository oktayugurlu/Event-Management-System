package com.etkinlikyonetimi.intern.usecases.manageparticipant.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.*;
import java.io.IOException;
import java.util.Date;
import java.util.Properties;

@Service
@RequiredArgsConstructor
public class MailSenderService {

    @Value(value = "${spring.mail.username}")
    private String mailAddress;

    @Value(value = "${spring.mail.password}")
    private String password;

    public void sendmail(String from,
                         String to,
                         String content,
                         String subject,
                         String qrCodePath) throws AddressException, MessagingException, IOException {
        var props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(mailAddress, password);
            }
        });
        Message msg = new MimeMessage(session);

        msg.setFrom(new InternetAddress(from, false));

        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
        msg.setSubject(subject);
        msg.setContent(content, "text/html");
        msg.setSentDate(new Date());

        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(content, "text/html");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);

        MimeBodyPart attachPart = new MimeBodyPart();
        attachPart.attachFile(qrCodePath);
        multipart.addBodyPart(attachPart);
        msg.setContent(multipart);

        Transport.send(msg);
    }
}
