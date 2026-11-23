package com.pottedLeaf.plantstore.service;

import com.pottedLeaf.plantstore.model.User;
import com.pottedLeaf.plantstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register
    public User registerUser(User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        return userRepository.save(user);
    }

    // Login
    public User login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }

        throw new RuntimeException("Invalid username or password");
    }

    // Get by ID
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}