package com.darkdrive.backend.service;


import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // 'true' enables HTML

        String subject = "Verify Your Dark Drive Account";
        String verificationUrl = "http://localhost:8080/auth/verify?token=" + token;
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #000000; color: #ffffff; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000000; }
                    .header { background-color: #ffd700; color: #000000; padding: 10px; text-align: center; }
                    .content { color:#dfdfdf; padding: 20px; }
                    .button { background-color: #ffd700; color: #000000; padding: 10px 20px; text-decoration: none; 
                              border-radius: 5px; display: inline-block; font-weight: bold; }
                    .footer { text-align: center; font-size: 12px; color: #dfdfdf; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Welcome to Dark Drive!</h2>
                    </div>
                    <div class="content">
                        <p>Thanks for signing up! Please verify your email to activate your account.</p>
                        <p><a href="%s" class="button">Verify Email</a></p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 Dark Drive. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(verificationUrl);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setFrom("your-email@gmail.com"); // Replace with your sender email
        helper.setText(htmlContent, true); // 'true' indicates HTML content

        mailSender.send(message);
    }
}