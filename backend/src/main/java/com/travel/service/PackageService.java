package com.travel.service;

import com.travel.entity.Flight;
import com.travel.entity.Hotel;
import com.travel.entity.Itinerary;
import com.travel.entity.TravelPackage;
import com.travel.repository.FlightRepository;
import com.travel.repository.HotelRepository;
import com.travel.repository.ItineraryRepository;
import com.travel.repository.TravelPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PackageService {

    @Autowired
    private TravelPackageRepository packageRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private ItineraryRepository itineraryRepository;

    public List<TravelPackage> getAllPackages() {
        return packageRepository.findAll();
    }

    public TravelPackage getPackageById(Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
    }

    public TravelPackage createPackage(TravelPackage travelPackage) {
        calculateTotals(travelPackage);
        return packageRepository.save(travelPackage);
    }

    public TravelPackage updatePackage(Long id, TravelPackage details) {
        TravelPackage pkg = getPackageById(id);
        pkg.setName(details.getName());
        pkg.setLocation(details.getLocation());
        pkg.setDuration(details.getDuration());
        pkg.setDescription(details.getDescription());

        // Update relationships if provided
        if (details.getHotels() != null) {
            pkg.setHotels(details.getHotels());
        }
        if (details.getFlights() != null) {
            pkg.setFlights(details.getFlights());
        }

        calculateTotals(pkg);

        return packageRepository.save(pkg);
    }

    private void calculateTotals(TravelPackage pkg) {
        double totalPrice = pkg.getPrice() != null ? pkg.getPrice() : 0.0;
        double totalCarbon = 0.0;

        if (pkg.getHotels() != null) {
            for (Hotel h : pkg.getHotels()) {
                // For calculation, we might need to fetch fresh specific entities if detached,
                // but assuming we have the data or will rely on what's passed if full objects.
                // Ideally, we fetch from DB to be sure of prices.
                // For now, simpler logic or trusting loaded entities.
                if (h.getPrice() != null)
                    totalPrice += h.getPrice();
                if (h.getCarbonFootprint() != null)
                    totalCarbon += h.getCarbonFootprint();
            }
        }

        if (pkg.getFlights() != null) {
            for (Flight f : pkg.getFlights()) {
                if (f.getPrice() != null)
                    totalPrice += f.getPrice();
                if (f.getCarbonFootprint() != null)
                    totalCarbon += f.getCarbonFootprint();
            }
        }

        pkg.setPrice(totalPrice);
        pkg.setTotalCarbonFootprint(totalCarbon);
    }

    @Autowired
    private com.travel.repository.BookingRepository bookingRepository;

    @org.springframework.transaction.annotation.Transactional
    public void deletePackage(Long id) {
        // Delete associated bookings first to avoid constraint violation
        bookingRepository.deleteByTravelPackageId(id);
        packageRepository.deleteById(id);
    }

    // Standalone creations
    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public Flight createFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // Link existing resources
    public TravelPackage addHotelToPackage(Long packageId, Long hotelId) {
        TravelPackage pkg = getPackageById(packageId);
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new RuntimeException("Hotel not found"));
        pkg.getHotels().add(hotel);
        calculateTotals(pkg);
        return packageRepository.save(pkg);
    }

    public TravelPackage addFlightToPackage(Long packageId, Long flightId) {
        TravelPackage pkg = getPackageById(packageId);
        Flight flight = flightRepository.findById(flightId).orElseThrow(() -> new RuntimeException("Flight not found"));
        pkg.getFlights().add(flight);
        calculateTotals(pkg);
        return packageRepository.save(pkg);
    }

    public Itinerary addItinerary(Long packageId, Itinerary itinerary) {
        TravelPackage pkg = getPackageById(packageId);
        itinerary.setTravelPackage(pkg);
        return itineraryRepository.save(itinerary);
    }
}
