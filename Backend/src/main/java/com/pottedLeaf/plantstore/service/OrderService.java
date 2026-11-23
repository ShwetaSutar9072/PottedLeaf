package com.pottedLeaf.plantstore.service;

import com.pottedLeaf.plantstore.model.*;
import com.pottedLeaf.plantstore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository itemRepository;

    public Order placeOrder(Long userId, String paymentMethod) {

        List<CartItem> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double total = cartItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        Order order = new Order();
        order.setUserId(userId);
        order.setTotalAmount(total);
        order.setStatus("CREATED");
        order.setPaymentMethod(paymentMethod);
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        // SAVE ORDER ITEMS
        for (CartItem c : cartItems) {
            OrderItem item = new OrderItem();
            item.setOrderId(savedOrder.getId());
            item.setPlantId(c.getPlantId());
            item.setPlantName(c.getPlantName());
            item.setPrice(c.getPrice());
            item.setQuantity(c.getQuantity());
            item.setImageUrl(c.getImageUrl());

            itemRepository.save(item);
        }

        // CLEAR CART
        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        return itemRepository.findByOrderId(orderId);
    }
}
