package com.travel.controller;

import com.travel.entity.Flight;
import com.travel.entity.Hotel;
import com.travel.entity.Itinerary;
import com.travel.entity.TravelPackage;
import com.travel.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private PackageService packageService;

    @Autowired
    private com.travel.service.BookingService bookingService;

    @Autowired
    private com.travel.repository.UserRepository userRepository; // Dirty hack to get ID, ideally from context

    // Package Endpoints
    @GetMapping("/packages")
    public ResponseEntity<List<TravelPackage>> getAllPackages() {
        return ResponseEntity.ok(packageService.getAllPackages());
    }

    @GetMapping("/packages/{id}")
    public ResponseEntity<TravelPackage> getPackageById(@PathVariable Long id) {
        return ResponseEntity.ok(packageService.getPackageById(id));
    }

    @GetMapping("/packages/{id}/hotels")
    public ResponseEntity<List<Hotel>> getHotels(@PathVariable Long id) {
        return ResponseEntity.ok(packageService.getPackageById(id).getHotels());
    }

    @GetMapping("/packages/{id}/flights")
    public ResponseEntity<List<Flight>> getFlights(@PathVariable Long id) {
        return ResponseEntity.ok(packageService.getPackageById(id).getFlights());
    }

    @GetMapping("/packages/{id}/itinerary")
    public ResponseEntity<List<Itinerary>> getItinerary(@PathVariable Long id) {
        return ResponseEntity.ok(packageService.getPackageById(id).getItinerary());
    }

    // Booking Endpoints
    @PostMapping("/bookings")
    public ResponseEntity<com.travel.entity.Booking> createBooking(@RequestBody com.travel.dto.BookingRequest request,
            java.security.Principal principal) {
        // Retrieve User ID from Principal (email)
        com.travel.entity.User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        request.setUserId(user.getId());
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<com.travel.entity.Booking>> getUserBookings(java.security.Principal principal) {
        com.travel.entity.User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }
}
