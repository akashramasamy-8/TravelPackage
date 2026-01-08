package com.travel.config;

import com.travel.entity.Flight;
import com.travel.entity.Hotel;
import com.travel.entity.Itinerary;
import com.travel.entity.TravelPackage;
import com.travel.repository.FlightRepository;
import com.travel.repository.HotelRepository;
import com.travel.repository.ItineraryRepository;
import com.travel.repository.TravelPackageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DataSeeder implements CommandLineRunner {

        private final HotelRepository hotelRepository;
        private final FlightRepository flightRepository;
        private final TravelPackageRepository packageRepository;
        private final ItineraryRepository itineraryRepository;

        public DataSeeder(HotelRepository hotelRepository, FlightRepository flightRepository,
                        TravelPackageRepository packageRepository, ItineraryRepository itineraryRepository) {
                this.hotelRepository = hotelRepository;
                this.flightRepository = flightRepository;
                this.packageRepository = packageRepository;
                this.itineraryRepository = itineraryRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                System.out.println("Starting Data Seeding...");
                seedHotels();
                seedFlights();
                seedPackages();
                System.out.println("Data Seeding Completed.");
        }

        private void seedHotels() {
                long count = hotelRepository.count();
                System.out.println("Current Hotel count: " + count);
                if (count < 5) { // Ensure we have enough hotels even if some exist
                        List<Hotel> hotels = Arrays.asList(
                                        // Asia
                                        new Hotel(null, "Ocean View Resort", "Maldives", 450.0, 4.8, 120.0),
                                        new Hotel(null, "Marina Bay Sands", "Singapore", 600.0, 4.9, 250.0),
                                        new Hotel(null, "Taj Lake Palace", "Udaipur, India", 350.0, 4.9, 90.0),
                                        new Hotel(null, "Kumarakom Lake Resort", "Kerala, India", 280.0, 4.7, 60.0),
                                        new Hotel(null, "Beachside Bungalow", "Bali, Indonesia", 120.0, 4.4, 40.0),
                                        new Hotel(null, "Aman Tokyo", "Tokyo, Japan", 900.0, 4.9, 300.0),
                                        new Hotel(null, "Raffles", "Istanbul, Turkey", 400.0, 4.8, 150.0),
                                        new Hotel(null, "Desert Oasis Resort", "Dubai", 500.0, 4.8, 200.0),

                                        // Europe
                                        new Hotel(null, "The Ritz Paris", "Paris, France", 1200.0, 5.0, 400.0),
                                        new Hotel(null, "Claridge's", "London, UK", 900.0, 4.8, 300.0),
                                        new Hotel(null, "Hotel Danieli", "Venice, Italy", 700.0, 4.7, 200.0),
                                        new Hotel(null, "Mystique", "Santorini, Greece", 850.0, 4.9, 180.0),
                                        new Hotel(null, "Mountain Retreat", "Zermatt, Switzerland", 300.0, 4.7, 80.0),
                                        new Hotel(null, "Historical Palace", "Rome, Italy", 350.0, 4.7, 70.0),

                                        // Americas
                                        new Hotel(null, "The Plaza", "New York, USA", 950.0, 4.6, 350.0),
                                        new Hotel(null, "Bellagio", "Las Vegas, USA", 400.0, 4.5, 200.0),
                                        new Hotel(null, "Fairmont Chateau Lake Louise", "Canada", 450.0, 4.8, 150.0),
                                        new Hotel(null, "Copacabana Palace", "Rio de Janeiro, Brazil", 550.0, 4.7,
                                                        120.0),
                                        new Hotel(null, "Jungle Lodge", "Amazon, Brazil", 150.0, 4.5, 30.0),

                                        // Oceania & Africa
                                        new Hotel(null, "Opera House View", "Sydney, Australia", 400.0, 4.6, 120.0),
                                        new Hotel(null, "Lizard Island Resort", "Queensland, Australia", 800.0, 4.8,
                                                        100.0),
                                        new Hotel(null, "Giraffe Manor", "Nairobi, Kenya", 1100.0, 4.9, 150.0),
                                        new Hotel(null, "Royal Mansour", "Marrakech, Morocco", 900.0, 4.9, 180.0));

                        // Check existence for each to avoid duplicates
                        for (Hotel h : hotels) {
                                if (hotelRepository.findAll().stream()
                                                .noneMatch(ex -> ex.getName().equals(h.getName()))) {
                                        hotelRepository.save(h);
                                }
                        }
                        System.out.println("Seeded Hotels");
                }
        }

        private void seedFlights() {
                long count = flightRepository.count();
                System.out.println("Current Flight count: " + count);
                if (count < 5) {
                        List<Flight> flights = Arrays.asList(
                                        new Flight(null, "New York", "London", "British Airways", 600.0, 300.0),
                                        new Flight(null, "London", "Paris", "Eurostar/Air France", 100.0, 20.0),
                                        new Flight(null, "Paris", "Rome", "Alitalia", 150.0, 60.0),
                                        new Flight(null, "Dubai", "Maldives", "Emirates", 400.0, 150.0),
                                        new Flight(null, "Tokyo", "San Francisco", "JAL", 900.0, 450.0),
                                        new Flight(null, "Sydney", "Singapore", "Singapore Airlines", 600.0, 280.0),
                                        new Flight(null, "Los Angeles", "New York", "Delta", 350.0, 180.0),
                                        new Flight(null, "Mumbai", "Dubai", "Air India", 200.0, 100.0),
                                        new Flight(null, "Delhi", "Udaipur", "IndiGo", 80.0, 40.0),
                                        new Flight(null, "Delhi", "Kochi", "Vistara", 120.0, 70.0),
                                        new Flight(null, "London", "Nairobi", "Kenya Airways", 700.0, 350.0),
                                        new Flight(null, "New York", "Rio de Janeiro", "LATAM", 800.0, 380.0),
                                        new Flight(null, "Sydney", "Cairns", "Qantas", 250.0, 90.0),
                                        new Flight(null, "Athens", "Santorini", "Aegean Airlines", 150.0, 40.0),
                                        new Flight(null, "Zurich", "Zermatt", "Swiss Train", 100.0, 10.0), // Train
                                                                                                           // simulated
                                                                                                           // as flight
                                        new Flight(null, "Paris", "Istanbul", "Turkish Airlines", 300.0, 120.0),
                                        new Flight(null, "Tokyo", "Sydney", "ANA", 850.0, 400.0),
                                        new Flight(null, "Vancouver", "Toronto", "Air Canada", 350.0, 150.0),
                                        new Flight(null, "Singapore", "Bali", "Scoot", 100.0, 50.0));

                        for (Flight f : flights) {
                                if (flightRepository.findAll().stream()
                                                .noneMatch(ex -> ex.getAirline().equals(f.getAirline())
                                                                && ex.getSource().equals(f.getSource())
                                                                && ex.getDestination().equals(f.getDestination()))) {
                                        flightRepository.save(f);
                                }
                        }
                        System.out.println("Seeded Flights");
                }
        }

        @Transactional
        public void seedPackages() {
                // Always try to add packages if they don't exist
                List<Hotel> hotels = hotelRepository.findAll();
                List<Flight> flights = flightRepository.findAll();

                if (hotels.isEmpty() || flights.isEmpty()) {
                        System.out.println("Hotels or Flights missing, skipping package seeding");
                        return;
                }

                // 1. Taj Mahal Expedition (Updated Image)
                createFullPackage(
                                "Taj Mahal Expedition", "India", "5 Days", 600.0,
                                "Experience the wonder of the Taj Mahal and vibrant culture of India.",
                                "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "Taj Lake Palace")),
                                Arrays.asList(findFlight(flights, "Delhi", "Udaipur")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Delhi", null),
                                                new Itinerary(null, 2, "Drive to Agra, Visit Taj Mahal", null),
                                                new Itinerary(null, 3, "Fatehpur Sikri and drive to Jaipur", null),
                                                new Itinerary(null, 4, "Amber Fort and City Palace", null),
                                                new Itinerary(null, 5, "Departure", null)));

                // 2. Kerala Backwaters (Fixed Image)
                createFullPackage(
                                "Kerala Backwaters", "India", "6 Days", 750.0,
                                "Relax in the serene backwaters of God's own country.",
                                "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "Kumarakom Lake Resort")),
                                Arrays.asList(findFlight(flights, "Delhi", "Kochi")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Kochi", null),
                                                new Itinerary(null, 2, "Houseboat Check-in Alleppey", null),
                                                new Itinerary(null, 3, "Backwater Cruise", null),
                                                new Itinerary(null, 4, "Munnar Tea Gardens", null),
                                                new Itinerary(null, 5, "Ayurvedic Spa Day", null),
                                                new Itinerary(null, 6, "Departure from Kochi", null)));

                // 3. Swiss Alps Advice (Existing)
                createFullPackage(
                                "Swiss Alps Adventure", "Europe", "6 Days", 1500.0,
                                "Skiing and hiking in the breathtaking Alps.",
                                "https://images.unsplash.com/photo-1530685932526-48ec92998eaa?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "Mountain Retreat")),
                                Arrays.asList(findFlight(flights, "Zurich", "Zermatt")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Zurich", null),
                                                new Itinerary(null, 2, "Glacier Express to Zermatt", null),
                                                new Itinerary(null, 3, "Matterhorn View & Hiking", null),
                                                new Itinerary(null, 4, "Skiing / Snowboarding", null),
                                                new Itinerary(null, 5, "Spa & Fondue", null),
                                                new Itinerary(null, 6, "Departure", null)));

                // 4. Paris Romantic Getaway
                createFullPackage(
                                "Paris Romantic Getaway", "Europe", "4 Days", 1200.0,
                                "Enjoy the city of love, Eiffel Tower and fine dining.",
                                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "The Ritz Paris")),
                                Arrays.asList(findFlight(flights, "New York", "London"),
                                                findFlight(flights, "London", "Paris")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Paris", null),
                                                new Itinerary(null, 2, "Eiffel Tower and Louvre Museum", null),
                                                new Itinerary(null, 3, "Seine River Cruise and Dinner", null),
                                                new Itinerary(null, 4, "Montmartre & Departure", null)));

                // 5. Grand Canyon Explorer
                createFullPackage(
                                "Grand Canyon Explorer", "USA", "5 Days", 1100.0,
                                "Hiking and sightseeing in the magnificent Grand Canyon.",
                                "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "Bellagio")), // Stay in Vegas
                                Arrays.asList(findFlight(flights, "Los Angeles", "New York")), // Proxy flight
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Las Vegas", null),
                                                new Itinerary(null, 2, "Drive to Grand Canyon", null),
                                                new Itinerary(null, 3, "Hiking South Rim", null),
                                                new Itinerary(null, 4, "Helicopter Tour", null),
                                                new Itinerary(null, 5, "Return to Vegas", null)));

                // 6. NYC Urban Jungle (Fixed Image)
                createFullPackage(
                                "NYC Urban Jungle", "USA", "4 Days", 1300.0,
                                "Times Square, Central Park, and Broadway shows.",
                                "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "The Plaza")),
                                Arrays.asList(findFlight(flights, "Los Angeles", "New York")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in NYC", null),
                                                new Itinerary(null, 2, "Statue of Liberty & Wall St", null),
                                                new Itinerary(null, 3, "Central Park & Met Museum", null),
                                                new Itinerary(null, 4, "Broadway Show & Times Square", null)));

                // 7. Great Barrier Reef (Fixed Image)
                createFullPackage(
                                "Great Barrier Reef", "Oceania", "7 Days", 1600.0,
                                "Snorkeling and diving in the world's largest coral reef.",
                                "https://images.unsplash.com/photo-1544551763-46a42a461dcf?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "Lizard Island Resort")),
                                Arrays.asList(findFlight(flights, "Sydney", "Cairns")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Cairns", null),
                                                new Itinerary(null, 2, "Transfer to Island", null),
                                                new Itinerary(null, 3, "Outer Reef Snorkeling", null),
                                                new Itinerary(null, 4, "Scuba Diving Course", null),
                                                new Itinerary(null, 5, "Marine Biology Tour", null),
                                                new Itinerary(null, 6, "Sunset Beach BBQ", null),
                                                new Itinerary(null, 7, "Departure", null)));

                // 8. Sydney Opera House
                createFullPackage(
                                "Sydney Opera House", "Oceania", "5 Days", 1400.0,
                                "Explore Sydney's iconic landmarks and beaches.",
                                "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "Opera House View")),
                                Arrays.asList(findFlight(flights, "Sydney", "Singapore")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Sydney", null),
                                                new Itinerary(null, 2, "Opera House Tour", null),
                                                new Itinerary(null, 3, "Bondi Beach Surf Lesson", null),
                                                new Itinerary(null, 4, "Harbour Bridge Climb", null),
                                                new Itinerary(null, 5, "The Rocks & Departure", null)));

                // 9. Santorini Sunset (NEW)
                createFullPackage(
                                "Santorini Sunset", "Europe", "5 Days", 1800.0,
                                "Whitewashed buildings, blue domes, and stunning sunsets.",
                                "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "Mystique")),
                                Arrays.asList(findFlight(flights, "Athens", "Santorini")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Thira", null),
                                                new Itinerary(null, 2, "Oia Sunset View", null),
                                                new Itinerary(null, 3, "Volcano Boat Tour", null),
                                                new Itinerary(null, 4, "Wine Tasting", null),
                                                new Itinerary(null, 5, "Departure", null)));

                // 10. Kyoto Ancient Temples (NEW)
                createFullPackage(
                                "Kyoto Ancient Temples", "Asia", "6 Days", 2000.0,
                                "Discover the traditional heart of Japan.",
                                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "Aman Tokyo")), // Proxy, travel to Kyoto
                                Arrays.asList(findFlight(flights, "Tokyo", "San Francisco")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Osaka/Kyoto", null),
                                                new Itinerary(null, 2, "Kinkaku-ji (Golden Pavilion)", null),
                                                new Itinerary(null, 3, "Fushimi Inari Shrine", null),
                                                new Itinerary(null, 4, "Arashiyama Bamboo Grove", null),
                                                new Itinerary(null, 5, "Gion Geisha District", null),
                                                new Itinerary(null, 6, "Tea Ceremony & Departure", null)));

                // 11. Safari in Kenya (NEW)
                createFullPackage(
                                "Safari in Kenya", "Africa", "7 Days", 2500.0,
                                "Witness the Big Five in their natural habitat.",
                                "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "Giraffe Manor")),
                                Arrays.asList(findFlight(flights, "London", "Nairobi")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Nairobi", null),
                                                new Itinerary(null, 2, "Transfer to Masai Mara", null),
                                                new Itinerary(null, 3, "Morning Game Drive", null),
                                                new Itinerary(null, 4, "Hot Air Balloon Safari", null),
                                                new Itinerary(null, 5, "Visit Masai Village", null),
                                                new Itinerary(null, 6, "Evening Game Drive", null),
                                                new Itinerary(null, 7, "Return to Nairobi", null)));

                // 12. Rio Carnival (NEW)
                createFullPackage(
                                "Rio Carnival", "South America", "5 Days", 1600.0,
                                "Samba, beaches, and the Christ Redeemer.",
                                "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800&auto=format&fit=crop",
                                Arrays.asList(findHotel(hotels, "Copacabana Palace")),
                                Arrays.asList(findFlight(flights, "New York", "Rio de Janeiro")),
                                Arrays.asList(
                                                new Itinerary(null, 1, "Arrival in Rio", null),
                                                new Itinerary(null, 2, "Christ the Redeemer & Sugarloaf", null),
                                                new Itinerary(null, 3, "Copacabana Beach Relax", null),
                                                new Itinerary(null, 4, "Samba School Rehearsal", null),
                                                new Itinerary(null, 5, "Departure", null)));

                System.out.println("Seeded/Verified Realistic Packages");
        }

        private Hotel findHotel(List<Hotel> hotels, String namePart) {
                return hotels.stream()
                                .filter(h -> h.getName().contains(namePart))
                                .findFirst()
                                .orElse(hotels.get(0));
        }

        private Flight findFlight(List<Flight> flights, String src, String dest) {
                return flights.stream()
                                .filter(f -> f.getSource().equalsIgnoreCase(src)
                                                || f.getDestination().equalsIgnoreCase(dest))
                                .findFirst()
                                .orElse(flights.get(0));
        }

        private void createFullPackage(
                        String name, String location, String duration, Double basePrice,
                        String description, String imageUrl,
                        List<Hotel> hotels, List<Flight> flights, List<Itinerary> itineraries) {

                if (packageRepository.findByName(name).isPresent()) {
                        System.out.println("Skipping package '" + name + "' (already exists).");
                        return;
                }

                System.out.println("Creating package: " + name);
                TravelPackage p = new TravelPackage();
                p.setName(name);
                p.setLocation(location);
                p.setDuration(duration);
                p.setDescription(description);
                p.setImageUrl(imageUrl);

                // Add resources
                p.setHotels(new ArrayList<>(hotels));
                p.setFlights(new ArrayList<>(flights));

                // Calculate totals
                double hotelPrice = hotels.stream().mapToDouble(Hotel::getPrice).sum();
                double flightPrice = flights.stream().mapToDouble(Flight::getPrice).sum();
                double hotelCarbon = hotels.stream().mapToDouble(Hotel::getCarbonFootprint).sum();
                double flightCarbon = flights.stream().mapToDouble(Flight::getCarbonFootprint).sum();

                p.setPrice(basePrice);
                p.setTotalCarbonFootprint(hotelCarbon + flightCarbon);

                TravelPackage saved = packageRepository.save(p);

                // Add Itinerary
                for (Itinerary it : itineraries) {
                        it.setTravelPackage(saved);
                        itineraryRepository.save(it);
                }
        }
}
