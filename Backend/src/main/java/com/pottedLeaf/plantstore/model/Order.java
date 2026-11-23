package com.pottedLeaf.plantstore.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private double totalAmount;
    private String status; // CREATED, PAID, SHIPPED
    private String paymentMethod; // COD, UPI, CARD, RAZORPAY
    private LocalDateTime orderDate;

    public Order() {}

    public Order(Long id, Long userId, double totalAmount,
                 String status, String paymentMethod,
                 LocalDateTime orderDate) {
        this.id = id;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.orderDate = orderDate;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public String getPaymentMethod() { return paymentMethod; }
    public LocalDateTime getOrderDate() { return orderDate; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public void setStatus(String status) { this.status = status; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
}