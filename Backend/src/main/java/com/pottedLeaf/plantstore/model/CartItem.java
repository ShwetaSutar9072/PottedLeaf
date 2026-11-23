package com.pottedLeaf.plantstore.model;

import jakarta.persistence.*;

@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long plantId;

    private String plantName;
    private double price;
    private int quantity;
    private String imageUrl;

    public CartItem() {}

    public CartItem(Long id, Long userId, Long plantId,
                    String plantName, double price,
                    int quantity, String imageUrl) {
        this.id = id;
        this.userId = userId;
        this.plantId = plantId;
        this.plantName = plantName;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    public Long getId() { 
    	return id; 
    	}
    public Long getUserId() {
    	return userId;
    	}
    public Long getPlantId() { 
    	return plantId; 
    	}
    public String getPlantName() {
    	return plantName; 
    	
    }
    public double getPrice() {
    	return price; 
    	}
    public int getQuantity() {
    	return quantity; 
    	}
    public String getImageUrl() {
    	return imageUrl; 
    	}

    public void setId(Long id) {
    	this.id = id; 
    	}
    public void setUserId(Long userId) {
    	this.userId = userId; 
    	}
    public void setPlantId(Long plantId) { 
    	this.plantId = plantId; 
    	}
    public void setPlantName(String plantName) {
    	this.plantName = plantName; 
    	}
    public void setPrice(double price) {
    	this.price = price;
    	}
    public void setQuantity(int quantity) {
    	this.quantity = quantity; 
    	}
    public void setImageUrl(String imageUrl) {
    	this.imageUrl = imageUrl; 
    	}
}