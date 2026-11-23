package com.pottedLeaf.plantstore.repository;

import com.pottedLeaf.plantstore.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}