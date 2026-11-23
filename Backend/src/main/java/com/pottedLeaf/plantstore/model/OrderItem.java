package com.pottedLeaf.plantstore.model;


import jakarta.persistence.*;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private Long plantId;

    private String plantName;
    private double price;
    private int quantity;
    private String imageUrl;

    public OrderItem() {}

    public OrderItem(Long id, Long orderId, Long plantId,
                     String plantName, double price,
                     int quantity, String imageUrl) {
        this.id = id;
        this.orderId = orderId;
        this.plantId = plantId;
        this.plantName = plantName;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public Long getOrderId() { return orderId; }
    public Long getPlantId() { return plantId; }
    public String getPlantName() { return plantName; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public String getImageUrl() { return imageUrl; }

    public void setId(Long id) { this.id = id; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public void setPlantId(Long plantId) { this.plantId = plantId; }
    public void setPlantName(String plantName) { this.plantName = plantName; }
    public void setPrice(double price) { this.price = price; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}