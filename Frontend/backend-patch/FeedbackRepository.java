package com.pottedLeaf.plantstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pottedLeaf.plantstore.model.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
