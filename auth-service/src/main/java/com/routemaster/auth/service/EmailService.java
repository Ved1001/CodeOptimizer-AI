package com.routemaster.auth.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String toEmail, String name) {
        String subject = "Welcome to LLMesh - Account Registration Successful!";
        String body = "Dear " + name + ",\n\n" +
                "Thank you for registering an account with LLMesh: AI Cost Optimizer & Gateway Router.\n\n" +
                "Your account has been successfully configured. You can now log in and deploy secure middleware proxy gateways to route your enterprise prompt transactions.\n\n" +
                "Best regards,\n" +
                "The LLMesh FinOps Team";
        sendEmail(toEmail, subject, body);
    }

    public void sendVerificationCodeEmail(String toEmail, String code) {
        String subject = "LLMesh Security Alert - Password Change Verification Code";
        String body = "Hello,\n\n" +
                "We received a request to change the password for your LLMesh command account.\n\n" +
                "Your single-use 6-digit verification code is:\n" +
                "-->  " + code + "  <--\n\n" +
                "This code is valid for 15 minutes. If you did not request this code, please secure your account immediately.\n\n" +
                "Best regards,\n" +
                "LLMesh SOC Team";
        sendEmail(toEmail, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("llmesh.portal@gmail.com");

            mailSender.send(message);
        } catch (Exception ex) {
            // Suppress exception / prevent system crashes when SMTP is offline
        }
    }
}
