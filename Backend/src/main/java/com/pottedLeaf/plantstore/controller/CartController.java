package com.pottedLeaf.plantstore.controller;


import com.pottedLeaf.plantstore.model.CartItem;
import com.pottedLeaf.plantstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
public class CartController {

    @Autowired
    private CartService cartService;

    // ADD TO CART
    @PostMapping("/add")
    public CartItem addToCart(@RequestBody CartItem item) {
        return cartService.addToCart(item);
    }

    // GET CART
    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartService.getUserCart(userId);
    }

    // UPDATE QTY
    @PutMapping("/{cartId}/{qty}")
    public CartItem updateQty(@PathVariable Long cartId,
                              @PathVariable int qty) {
        return cartService.updateQuantity(cartId, qty);
    }

    // DELETE ITEM
    @DeleteMapping("/{cartId}")
    public void delete(@PathVariable Long cartId) {
        cartService.removeItem(cartId);
    }

    // CLEAR CART
    @DeleteMapping("/clear/{userId}")
    public void clear(@PathVariable Long userId) {
        cartService.clearCart(userId);
    }
}