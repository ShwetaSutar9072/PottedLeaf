package com.pottedLeaf.plantstore.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.pottedLeaf.plantstore.model.Order;
import com.pottedLeaf.plantstore.model.User;
import com.pottedLeaf.plantstore.repository.OrderRepository;
import com.pottedLeaf.plantstore.repository.UserRepository;

/**
 * Admin-only endpoints: all orders, change order status, list customers, upload product images.
 * The caller sends its user id in the X-User-Id header and must be the user named "admin".
 * NOTE: this is a simple check, not real security. Use Spring Security + JWT before going live.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class AdminController {

    private static final String ADMIN_USERNAME = "admin";
    private static final Set<String> STATUSES = Set.of("CREATED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED");
    private static final Set<String> IMAGE_TYPES = Set.of("jpg", "jpeg", "png", "webp", "gif");
    public static final Path UPLOAD_DIR = Paths.get("uploads").toAbsolutePath();

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;

    private void requireAdmin(Long adminId) {
        User u = adminId == null ? null : userRepository.findById(adminId).orElse(null);
        if (u == null || !ADMIN_USERNAME.equals(u.getUsername()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin only");
    }

    // ALL ORDERS
    @GetMapping("/orders")
    public List<Order> allOrders(@RequestHeader(value = "X-User-Id", required = false) Long adminId) {
        requireAdmin(adminId);
        return orderRepository.findAll();
    }

    // CHANGE ORDER STATUS
    @PutMapping("/orders/{id}/status/{status}")
    public Order setStatus(@RequestHeader(value = "X-User-Id", required = false) Long adminId,
                           @PathVariable Long id, @PathVariable String status) {
        requireAdmin(adminId);
        String s = status.toUpperCase();
        if (!STATUSES.contains(s))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown status: " + status);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        order.setStatus(s);
        return orderRepository.save(order);
    }

    // ALL CUSTOMERS (passwords are never sent)
    @GetMapping("/users")
    public List<Map<String, Object>> users(@RequestHeader(value = "X-User-Id", required = false) Long adminId) {
        requireAdmin(adminId);
        List<Map<String, Object>> out = new ArrayList<>();
        for (User u : userRepository.findAll()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId());
            m.put("fullName", u.getFullName());
            m.put("username", u.getUsername());
            m.put("email", u.getEmail());
            m.put("phone", u.getPhone());
            m.put("address", u.getAddress());
            out.add(m);
        }
        return out;
    }

    // UPLOAD PRODUCT IMAGE -> returns { "url": "/uploads/<file>" }
    @PostMapping("/upload")
    public Map<String, String> upload(@RequestHeader(value = "X-User-Id", required = false) Long adminId,
                                      @RequestParam("file") MultipartFile file) throws IOException {
        requireAdmin(adminId);
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String ext = name.contains(".") ? name.substring(name.lastIndexOf('.') + 1).toLowerCase() : "";
        if (file.isEmpty() || !IMAGE_TYPES.contains(ext))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Upload a jpg, png, webp or gif image");
        Files.createDirectories(UPLOAD_DIR);
        String saved = UUID.randomUUID() + "." + ext;
        file.transferTo(UPLOAD_DIR.resolve(saved));
        return Map.of("url", "/uploads/" + saved);
    }
}
