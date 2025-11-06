package com.metrocarpool.matching.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class MatchingService {
    @KafkaListener(topics = "driver-updates", groupId = "matching-service")
    public void driverInfoUpdateCache(Long driverId, String oldStation, String nextStation, Duration timeToNextStation,
                                  Integer availableSeats, String finalDestination) {
        // Update in Redis cache
    }

    @KafkaListener(topics = "rider-requests", groupId = "matching-service")
    public void riderInfoDriverMatchingAlgorithm(Long riderId, String pickUpStation, com.google.protobuf.Timestamp arrivalTime, String destinationPlace) {
        // Push in waiting queue
    }

    @Scheduled(cron = "* * * * * *")
    public void matchingAlgorithm() {
        // Write the Kafka producer logic here after matching
    }
}
