package com.pottedLeaf.plantstore.controller;


import com.pottedLeaf.plantstore.model.User;
import com.pottedLeaf.plantstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // LOGIN
    @PostMapping("/login")
    public User login(@RequestParam String username,
                      @RequestParam String password) {
        return userService.login(username, password);
    }

    // GET USER
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }
}