package com.pottedLeaf.plantstore.service;

import com.pottedLeaf.plantstore.model.CartItem;
import com.pottedLeaf.plantstore.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // ADD TO CART
    public CartItem addToCart(CartItem item) {

        // if already exists → increase quantity
        CartItem existing = cartRepository
                .findByUserIdAndPlantId(item.getUserId(), item.getPlantId())
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + item.getQuantity());
            return cartRepository.save(existing);
        }

        return cartRepository.save(item);
    }

    // GET USER CART
    public List<CartItem> getUserCart(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    // UPDATE QTY
    public CartItem updateQuantity(Long cartId, int qty) {
        CartItem item = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(qty);
        return cartRepository.save(item);
    }

    // REMOVE ITEM
    public void removeItem(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    // CLEAR CART (after order)
    public void clearCart(Long userId) {
        List<CartItem> items = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(items);
    }
}