CREATE TABLE IF NOT EXISTS package_flights (
    package_id BIGINT NOT NULL,
    flight_id BIGINT NOT NULL,
    PRIMARY KEY (package_id, flight_id),
    CONSTRAINT fk_pf_package FOREIGN KEY (package_id) REFERENCES travel_package (id),
    CONSTRAINT fk_pf_flight FOREIGN KEY (flight_id) REFERENCES flight (id)
);
