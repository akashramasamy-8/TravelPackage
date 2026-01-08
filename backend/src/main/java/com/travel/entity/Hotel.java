package com.travel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private Double price; // Price per night or per stay
    private Double rating;
    private Double carbonFootprint; // CO2e per night in kg

    // Removed @ManyToOne TravelPackage since it's now a shared resource or
    // ManyToMany handled by Package

}
