package com.travel.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:1234") // React port
public class SwiggySecondProxyController {

        @Autowired
        private RestTemplate restTemplate;

        @GetMapping("/menu/{restaurantId}")
        public ResponseEntity<String> getMenu(@PathVariable String restaurantId) {

                String json = """
                                {
                                  "statusCode": 0,
                                  "statusMessage": "done successfully",
                                  "data": {
                                    "cards": [
                                      {}, {}, {}, {},
                                      {
                                        "groupedCard": {
                                          "cardGroupMap": {
                                            "REGULAR": {
                                              "cards": [
                                                {
                                                  "card": {
                                                    "card": {
                                                      "@type": "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory",
                                                      "title": "Recommended",
                                                      "itemCards": [

                                                        {
                                                          "card": {
                                                            "@type": "type.googleapis.com/swiggy.presentation.food.v2.Dish",
                                                            "info": {
                                                              "id": "1",
                                                              "imageId": "FOOD_CATALOG/IMAGES/CMS/2024/4/1/bc13914a-84e1-4c79-8927-ad2524d8b26b_cf992125-2d3e-4d44-b200-947e0b389df4.jpg_compressed",
                                                              "name": "Chilli Paneer Dry",
                                                              "category": "North Indian",
                                                              "description": "Serves 1",
                                                              "price": 21500,
                                                              "isVeg": 1,
                                                              "inStock": 1,
                                                              "ratings": {
                                                                "aggregatedRating": {
                                                                  "rating": "4.3",
                                                                  "ratingCount": "52 ratings"
                                                                }
                                                              }
                                                            }
                                                          }
                                                        },

                                                        {
                                                          "card": {
                                                            "@type": "type.googleapis.com/swiggy.presentation.food.v2.Dish",
                                                            "info": {
                                                              "id": "2",
                                                              "imageId": "FOOD_CATALOG/IMAGES/CMS/2024/4/1/13c30469-d185-4303-9837-a1c157677b46_4faa6212-8c4b-4ae5-aea6-140e9a738fd5.jpg_compressed",
                                                              "name": "Paneer Butter Masala",
                                                              "category": "North Indian",
                                                              "description": "Creamy gravy, serves 1",
                                                              "price": 24000,
                                                              "isVeg": 1,
                                                              "inStock": 1,
                                                              "ratings": {
                                                                "aggregatedRating": {
                                                                  "rating": "4.5",
                                                                  "ratingCount": "87 ratings"
                                                                }
                                                              }
                                                            }
                                                          }
                                                        },

                                                        {
                                                          "card": {
                                                            "@type": "type.googleapis.com/swiggy.presentation.food.v2.Dish",
                                                            "info": {
                                                              "id": "3",
                                                              "imageId": "FOOD_CATALOG/IMAGES/CMS/2024/4/1/4bf0f762-c7ab-4af0-9ca8-cc2f61954a45_8b6b1a4f-b665-44be-b280-04e8e9683e14.jpg_compressed",
                                                              "name": "Veg Fried Rice",
                                                              "category": "Chinese",
                                                              "description": "Serves 1",
                                                              "price": 18000,
                                                              "isVeg": 1,
                                                              "inStock": 1,
                                                              "ratings": {
                                                                "aggregatedRating": {
                                                                  "rating": "4.2",
                                                                  "ratingCount": "64 ratings"
                                                                }
                                                              }
                                                            }
                                                          }
                                                        },

                                                        {
                                                          "card": {
                                                            "@type": "type.googleapis.com/swiggy.presentation.food.v2.Dish",
                                                            "info": {
                                                              "id": "4",
                                                              "imageId": "FOOD_CATALOG/IMAGES/CMS/2024/4/1/3316c259-578c-4187-88ed-997a16802587_27d0d12b-31fe-473c-b78a-4870e20443ad.jpg_compressed",
                                                              "name": "Gobi Manchurian",
                                                              "category": "Chinese",
                                                              "description": "Crispy starter",
                                                              "price": 19000,
                                                              "isVeg": 1,
                                                              "inStock": 1,
                                                              "ratings": {
                                                                "aggregatedRating": {
                                                                  "rating": "4.4",
                                                                  "ratingCount": "71 ratings"
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }

                                                      ]
                                                    }
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        }
                                      }
                                    ]
                                  }
                                }
                                """;

                return ResponseEntity.ok(json);
        }
}