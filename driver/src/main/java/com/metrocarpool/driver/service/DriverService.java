package com.metrocarpool.driver.service;

import com.metrocarpool.contracts.proto.DriverLocationEvent;
import com.metrocarpool.contracts.proto.DriverRideCompletionEvent;
import com.metrocarpool.driver.cache.DriverCache;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.kafka.support.Acknowledgment;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class DriverService {
    // ✅ Inject KafkaTemplate to publish events (assuming Spring Boot Kafka configured)
    private final KafkaTemplate<String, Object> kafkaTemplate;

    // Kafka topics
    private static final String DRIVER_TOPIC = "driver-updates";
    private static final String RIDE_COMPLETION_TOPIC = "trip-completed";

    // Redis Cache top level key
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String DRIVER_CACHE_KEY = "drivers";

    public boolean processDriverInfo(Long driverId, List<String> routeStations, String finalDestination,
                                     Integer availableSeats) {
        try {
            // Update this driver in cache
            Map<Long, Object> allDriverCacheData = (Map<Long, Object>) redisTemplate.opsForValue().get(DRIVER_CACHE_KEY);
            if (allDriverCacheData == null) {
                allDriverCacheData = new HashMap<>();
            }
            DriverCache driverCache = DriverCache.builder()
                    .availableSeats(availableSeats)
                    .routeStations(routeStations)
                    .nextStation(routeStations.get(0))
                    .timeToNextStation(Duration.ZERO)
                    .finalDestination(finalDestination)
                    .build();
            allDriverCacheData.put(driverId, driverCache);

            System.out.println("Driver ID: " + driverId);
            return true;
        } catch (Exception e) {
            log.error("❌ Failed to process driver info for ID {}: {}", driverId, e.getMessage());
            return false;
        }
    }

    @KafkaListener(topics = "rider-driver-match", groupId = "matching-service")
    public void matchFoundUpdateCache(Long driverId, Long riderId, String pickUpStation,
                                      Acknowledgment acknowledgment) {
        // Acknowledge that you have got the message
        acknowledgment.acknowledge();

        // Decrement the availableSeats by 1 for this driverId
        Map<Long, Object> allDriverCacheData = (Map<Long, Object>) redisTemplate.opsForValue().get(DRIVER_CACHE_KEY);
        DriverCache driverCache = (DriverCache) allDriverCacheData.get(driverId);
        Integer currentAvailableSeats = driverCache.getAvailableSeats();
        currentAvailableSeats = currentAvailableSeats - 1;

        // If availableSeats == 0 => evict from cache
        if (currentAvailableSeats == 0) {
            allDriverCacheData.remove(driverId);
        }
        redisTemplate.opsForValue().set(DRIVER_CACHE_KEY, allDriverCacheData);
    }

    @Scheduled(fixedRate = 60000)
    public void cronJobDriverLocationSimulation() {
        // CRON job will simulate the location => Simulation logic
        // Update in the Redis cache accordingly

        DriverLocationEvent driverLocationEvent = DriverLocationEvent.newBuilder()
                .setDriverId(1)
                .setOldStation("blah blah")
                .setNextStation("blah")
                .setAvailableSeats(5)
                .setFinalDestination("A1")
                .build();

        kafkaTemplate.send(DRIVER_TOPIC, driverLocationEvent);

        // If a driver reaches his final destination then we emit an appropriate event.
        DriverRideCompletionEvent driverRideCompletionEvent = DriverRideCompletionEvent.newBuilder()
                .setDriverId(1)
                .build();

        kafkaTemplate.send(RIDE_COMPLETION_TOPIC, driverRideCompletionEvent);
    }
}