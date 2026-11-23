package com.pottedLeaf.plantstore.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.pottedLeaf.plantstore.model.Plant;
import com.pottedLeaf.plantstore.service.PlantService;

@RestController
@RequestMapping("/api/admin/plants")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class PlantController {

    private final PlantService service;

    public PlantController(PlantService service) {
        this.service = service;
    }

    @GetMapping
    public List<Plant> getAll() {
        return service.getAllPlants();
    }

    @GetMapping("/{id}")
    public Plant getById(@PathVariable Long id) {
        return service.getPlantById(id);
    }

    @PostMapping   // <-- this annotation was missing, so "add product" could not work
    public Plant create(@RequestBody Plant plant) {
        return service.savePlant(plant);
    }

    @PutMapping("/{id}")
    public Plant update(@PathVariable Long id, @RequestBody Plant plant) {
        return service.updatePlant(id, plant);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deletePlant(id);
    }
}
