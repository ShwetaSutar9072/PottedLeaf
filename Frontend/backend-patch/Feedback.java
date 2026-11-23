package com.pottedLeaf.plantstore.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;

    @Column(length = 2000)
    private String message;

    private LocalDateTime submittedAt;
    private boolean read = false;

    public Feedback() {}

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getMessage() { return message; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public boolean isRead() { return read; }

    public void setId(Long id) { this.id = id; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setMessage(String message) { this.message = message; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public void setRead(boolean read) { this.read = read; }
}
