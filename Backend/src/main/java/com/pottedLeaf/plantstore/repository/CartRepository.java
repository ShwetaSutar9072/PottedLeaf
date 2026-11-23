package com.pottedLeaf.plantstore.repository;

import com.pottedLeaf.plantstore.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);

    Optional<CartItem> findByUserIdAndPlantId(Long userId, Long plantId);
}