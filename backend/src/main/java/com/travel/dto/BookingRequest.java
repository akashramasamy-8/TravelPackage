package com.travel.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long userId; // Optional if we use auth context, but useful if passed
    private Long packageId;
    private Long hotelId;
    private Long flightId;
    private String roomType; // STANDARD, DELUXE, SUITE
    private String flightClass; // ECONOMY, BUSINESS, FIRST
}
