package com.travel.controller;

import com.travel.entity.Flight;
import com.travel.entity.Hotel;
import com.travel.entity.Itinerary;
import com.travel.entity.TravelPackage;
import com.travel.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private PackageService packageService;

    @Autowired
    private com.travel.service.BookingService bookingService;

    @PostMapping("/packages")
    public ResponseEntity<TravelPackage> createPackage(@RequestBody TravelPackage travelPackage) {
        return ResponseEntity.ok(packageService.createPackage(travelPackage));
    }

    @PutMapping("/packages/{id}")
    public ResponseEntity<TravelPackage> updatePackage(@PathVariable Long id,
            @RequestBody TravelPackage travelPackage) {
        return ResponseEntity.ok(packageService.updatePackage(id, travelPackage));
    }

    @DeleteMapping("/packages/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        packageService.deletePackage(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/hotels")
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        return ResponseEntity.ok(packageService.createHotel(hotel));
    }

    @GetMapping("/hotels")
    public ResponseEntity<java.util.List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(packageService.getAllHotels());
    }

    @PostMapping("/flights")
    public ResponseEntity<Flight> createFlight(@RequestBody Flight flight) {
        return ResponseEntity.ok(packageService.createFlight(flight));
    }

    @GetMapping("/flights")
    public ResponseEntity<java.util.List<Flight>> getAllFlights() {
        return ResponseEntity.ok(packageService.getAllFlights());
    }

    @PostMapping("/packages/{id}/hotels/{hotelId}")
    public ResponseEntity<TravelPackage> addHotelToPackage(@PathVariable Long id, @PathVariable Long hotelId) {
        return ResponseEntity.ok(packageService.addHotelToPackage(id, hotelId));
    }

    @PostMapping("/packages/{id}/flights/{flightId}")
    public ResponseEntity<TravelPackage> addFlightToPackage(@PathVariable Long id, @PathVariable Long flightId) {
        return ResponseEntity.ok(packageService.addFlightToPackage(id, flightId));
    }

    @PostMapping("/packages/{id}/itinerary")
    public ResponseEntity<Itinerary> addItinerary(@PathVariable Long id, @RequestBody Itinerary itinerary) {
        return ResponseEntity.ok(packageService.addItinerary(id, itinerary));
    }

    // Booking Endpoints
    @GetMapping("/bookings")
    public ResponseEntity<java.util.List<com.travel.entity.Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<com.travel.entity.Booking> updateBookingStatus(@PathVariable Long id,
            @RequestParam com.travel.entity.Booking.BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }
}
