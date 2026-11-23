package com.pottedLeaf.plantstore.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.pottedLeaf.plantstore.model.User;
import com.pottedLeaf.plantstore.repository.UserRepository;

/**
 * Reset a forgotten password.
 * The person must give the username AND the email they registered with.
 * NOTE: this is a simple check. For a real site, email a one-time link or OTP instead,
 * and store passwords hashed (BCrypt).
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class PasswordController {

    @Autowired
    private UserRepository userRepository;

    // POST /api/users/reset-password   body: { "username": "...", "email": "...", "newPassword": "..." }
    @PostMapping("/reset-password")
    public Map<String, String> reset(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "").trim();
        String email = body.getOrDefault("email", "").trim();
        String newPassword = body.getOrDefault("newPassword", "");

        if (newPassword.length() < 6)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");

        // same message for "no such user" and "wrong email", so nobody can probe which usernames exist
        User user = userRepository.findByUsername(username)
                .filter(u -> u.getEmail() != null && u.getEmail().equalsIgnoreCase(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Username and email do not match"));

        user.setPassword(newPassword);
        userRepository.save(user);
        return Map.of("message", "Password updated");
    }
}
