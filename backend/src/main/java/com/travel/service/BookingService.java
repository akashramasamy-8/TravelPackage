package com.travel.service;

import com.travel.entity.Booking;
import com.travel.entity.TravelPackage;
import com.travel.entity.User;
import com.travel.repository.BookingRepository;
import com.travel.repository.TravelPackageRepository;
import com.travel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TravelPackageRepository packageRepository;

    @Autowired
    private com.travel.repository.HotelRepository hotelRepository;

    @Autowired
    private com.travel.repository.FlightRepository flightRepository;

    public Booking createBooking(com.travel.dto.BookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TravelPackage pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTravelPackage(pkg);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        // Customization
        double totalPrice = pkg.getPrice(); // Start with base price of package (mostly just base fees if components are
                                            // separated, but let's assume it's base)

        if (request.getHotelId() != null) {
            com.travel.entity.Hotel hotel = hotelRepository.findById(request.getHotelId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            booking.setSelectedHotel(hotel);

            double hotelPrice = hotel.getPrice() != null ? hotel.getPrice() : 0.0;
            // Room Type Logic
            if ("DELUXE".equalsIgnoreCase(request.getRoomType())) {
                hotelPrice *= 1.2;
            } else if ("SUITE".equalsIgnoreCase(request.getRoomType())) {
                hotelPrice *= 1.5;
            }
            totalPrice += hotelPrice;
            booking.setRoomType(request.getRoomType());
        }

        if (request.getFlightId() != null) {
            com.travel.entity.Flight flight = flightRepository.findById(request.getFlightId())
                    .orElseThrow(() -> new RuntimeException("Flight not found"));
            booking.setSelectedFlight(flight);

            double flightPrice = flight.getPrice() != null ? flight.getPrice() : 0.0;
            // Flight Class Logic
            if ("BUSINESS".equalsIgnoreCase(request.getFlightClass())) {
                flightPrice *= 2.0;
            } else if ("FIRST".equalsIgnoreCase(request.getFlightClass())) {
                flightPrice *= 3.0;
            }
            totalPrice += flightPrice;
            booking.setFlightClass(request.getFlightClass());
        }

        booking.setTotalPrice(totalPrice);

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBookingStatus(Long bookingId, Booking.BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}
