package com.travel.repository;

import com.travel.entity.TravelPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TravelPackageRepository extends JpaRepository<TravelPackage, Long> {
    Optional<TravelPackage> findByName(String name);
}
