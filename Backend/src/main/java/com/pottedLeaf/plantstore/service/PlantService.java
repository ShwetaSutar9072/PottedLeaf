package com.pottedLeaf.plantstore.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.pottedLeaf.plantstore.model.Plant;
import com.pottedLeaf.plantstore.repository.PlantRepository;

@Service
public class PlantService {

    private final PlantRepository repo;

    public PlantService(PlantRepository repo) {
        this.repo = repo;
    }

    public List<Plant> getAllPlants() {
        return repo.findAll();
    }

    public Plant getPlantById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found with id " + id));
    }

    public Plant savePlant(Plant plant) {
        return repo.save(plant);
    }

    
    public Plant updatePlant(Long id, Plant updatedPlant) {
        Plant plant = getPlantById(id);

        plant.setName(updatedPlant.getName());
        plant.setCategory(updatedPlant.getCategory());
        plant.setPrice(updatedPlant.getPrice());
        plant.setDescription(updatedPlant.getDescription());
        plant.setImageUrl(updatedPlant.getImageUrl());
        plant.setStock(updatedPlant.getStock());

        return repo.save(plant);
    }

    public void deletePlant(Long id) {
        repo.deleteById(id);
    }
}