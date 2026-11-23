package com.pottedLeaf.plantstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pottedLeaf.plantstore.model.Plant;

public interface PlantRepository extends JpaRepository<Plant, Long> {
	
}