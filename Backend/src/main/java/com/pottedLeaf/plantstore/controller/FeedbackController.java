package com.pottedLeaf.plantstore.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.pottedLeaf.plantstore.model.Feedback;
import com.pottedLeaf.plantstore.model.User;
import com.pottedLeaf.plantstore.repository.FeedbackRepository;
import com.pottedLeaf.plantstore.repository.UserRepository;

/**
 * Feedback from the "Send feedback" page. Anyone can submit; only the admin can read it.
 */
@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class FeedbackController {

    private static final String ADMIN_USERNAME = "admin";

    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private UserRepository userRepository;

    // POST /api/feedback  body: { fullName, email, message }
    @PostMapping
    public Feedback submit(@RequestBody Feedback feedback) {
        feedback.setId(null);
        feedback.setSubmittedAt(LocalDateTime.now());
        feedback.setRead(false);
        return feedbackRepository.save(feedback);
    }

    // GET /api/feedback  (admin only, newest first)
    @GetMapping
    public List<Feedback> all(@RequestHeader(value = "X-User-Id", required = false) Long adminId) {
        requireAdmin(adminId);
        List<Feedback> list = feedbackRepository.findAll();
        list.sort((a, b) -> b.getId().compareTo(a.getId()));
        return list;
    }

    // PUT /api/feedback/{id}/read  (admin only, marks as read)
    @PutMapping("/{id}/read")
    public Feedback markRead(@RequestHeader(value = "X-User-Id", required = false) Long adminId, @PathVariable Long id) {
        requireAdmin(adminId);
        Feedback f = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));
        f.setRead(true);
        return feedbackRepository.save(f);
    }

    // DELETE /api/feedback/{id}  (admin only)
    @DeleteMapping("/{id}")
    public void delete(@RequestHeader(value = "X-User-Id", required = false) Long adminId, @PathVariable Long id) {
        requireAdmin(adminId);
        feedbackRepository.deleteById(id);
    }

    private void requireAdmin(Long adminId) {
        User u = adminId == null ? null : userRepository.findById(adminId).orElse(null);
        if (u == null || !ADMIN_USERNAME.equals(u.getUsername()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin only");
    }
}
