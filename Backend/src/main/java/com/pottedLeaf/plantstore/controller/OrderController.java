package com.pottedLeaf.plantstore.controller;


import com.pottedLeaf.plantstore.model.Order;
import com.pottedLeaf.plantstore.model.OrderItem;
import com.pottedLeaf.plantstore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // PLACE ORDER
    @PostMapping("/place/{userId}/{paymentMethod}")
    public Order placeOrder(@PathVariable Long userId,
                            @PathVariable String paymentMethod) {
        return orderService.placeOrder(userId, paymentMethod);
    }

    // ORDER HISTORY
    @GetMapping("/user/{userId}")
    public List<Order> userOrders(@PathVariable Long userId) {
        return orderService.getUserOrders(userId);
    }

    // ORDER ITEMS
    @GetMapping("/items/{orderId}")
    public List<OrderItem> orderItems(@PathVariable Long orderId) {
        return orderService.getOrderItems(orderId);
    }
}