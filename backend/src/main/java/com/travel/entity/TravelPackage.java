package com.travel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String duration;
    private Double price;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    // Relationships can be defined here or just managed via foreign keys in child
    // entities.
    // For cascade delete, it's often useful to have them here.

    private Double totalCarbonFootprint;

    @ManyToMany
    @JoinTable(name = "package_hotels", joinColumns = @JoinColumn(name = "package_id"), inverseJoinColumns = @JoinColumn(name = "hotel_id"))
    private List<Hotel> hotels;

    @ManyToMany
    @JoinTable(name = "package_flights", joinColumns = @JoinColumn(name = "package_id"), inverseJoinColumns = @JoinColumn(name = "flight_id"))
    private List<Flight> flights;

    @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Itinerary> itinerary;
}
