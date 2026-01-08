package com.travel.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:1234") // React app
public class SwiggyProxyController {

    @GetMapping("/restaurants")
    public ResponseEntity<String> getRestaurants() {

        String url = "https://www.swiggy.com/dapi/restaurants/list/v5?lat=10.9601165&lng=78.0750137&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0");
        headers.set("Accept", "application/json");
        headers.set("Referer", "https://www.swiggy.com/");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class);

        return ResponseEntity.ok(response.getBody());
    }
}
