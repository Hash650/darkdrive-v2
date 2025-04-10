package com.darkdrive.backend.service;

import com.darkdrive.backend.model.User;
import com.darkdrive.backend.model.VerificationToken;
import com.darkdrive.backend.repository.UserRepository;
import com.darkdrive.backend.repository.VerificationTokenRepository;
import com.darkdrive.backend.util.JwtUtil;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    public User register(String username, String email, String password) throws Exception {
        if (userRepository.findByUsername(username).isPresent() ||
                userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Username or email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(false);
        userRepository.save(user);

        // Generate token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(user, token);
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(email, token); // This method may throw an exception
        return user;
    }

    public boolean verify(String token) {
        Optional<VerificationToken> verificationToken = verificationTokenRepository.findByToken(token);
        if (verificationToken.isPresent() && verificationToken.get().getExpiryDate().isAfter(LocalDateTime.now())) {
            User user = verificationToken.get().getUser();
            user.setEnabled(true);
            userRepository.save(user);
            verificationTokenRepository.delete(verificationToken.get());
            return true;
        }
        return false;
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid Credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid Credentials");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Please verify your email");
        }

        return jwtUtil.generateToken(email);
    }
}
