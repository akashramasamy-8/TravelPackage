package com.travel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime bookingDate;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "package_id")
    private TravelPackage travelPackage;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel selectedHotel;

    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight selectedFlight;

    private String roomType; // STANDARD, DELUXE, SUITE
    private String flightClass; // ECONOMY, BUSINESS, FIRST
    private Double totalPrice;

    public enum BookingStatus {
        CONFIRMED,
        CANCELLED
    }
}
