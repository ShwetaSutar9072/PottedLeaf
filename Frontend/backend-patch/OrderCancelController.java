package com.pottedLeaf.plantstore.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.pottedLeaf.plantstore.model.Order;
import com.pottedLeaf.plantstore.repository.OrderRepository;

/**
 * Lets a customer cancel their OWN order, only while it has not shipped yet.
 * The admin's own status control (AdminController) can still set any status, including SHIPPED/DELIVERED.
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class OrderCancelController {

    private static final Set<String> CANCELLABLE = Set.of("CREATED", "PAID");

    @Autowired
    private OrderRepository orderRepository;

    // PUT /api/orders/{orderId}/cancel/{userId}
    @PutMapping("/{orderId}/cancel/{userId}")
    public Order cancel(@PathVariable Long orderId, @PathVariable Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!order.getUserId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This is not your order");

        if (!CANCELLABLE.contains(order.getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "This order has already " + order.getStatus().toLowerCase() + " and can no longer be cancelled");

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
}
