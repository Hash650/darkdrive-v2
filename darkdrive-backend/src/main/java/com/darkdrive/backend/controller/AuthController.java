package com.darkdrive.backend.controller;

import com.darkdrive.backend.dto.LoginRequest;
import com.darkdrive.backend.dto.RegisterRequest;
import com.darkdrive.backend.service.AuthService;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/verify")
    public ResponseEntity<String> verify(
            @RequestParam String token) {
        if (authService.verify(token)) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("http://localhost:5173/")) // hardcoded
                    .build();
        }

        return ResponseEntity.ok().body("Invalid or expired token");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request

    ) {
        try {

            authService.register(request.getUsername(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok("User resgistered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(409).body("An user with this email or username already exists");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest request) {

        try {

            String token = authService.login(request.getEmail(), request.getPassword());

            return ResponseEntity.ok(token);
        }

        catch (RuntimeException rte) {

            if (rte.getMessage().equals("Invalid Credentials")) {

                return ResponseEntity.status(404).body(rte.getMessage());
            } else {

                return ResponseEntity.status(401).body(rte.getMessage());

            }

        }

    }

}
