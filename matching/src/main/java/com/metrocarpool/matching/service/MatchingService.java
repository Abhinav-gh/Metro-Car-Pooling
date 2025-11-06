package com.metrocarpool.matching.service;

import com.google.protobuf.Timestamp;
import com.metrocarpool.contracts.proto.DriverRiderMatchEvent;
import com.metrocarpool.matching.cache.MatchingDriverCache;
import com.metrocarpool.matching.cache.RiderWaitingQueueCache;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.kafka.support.Acknowledgment;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import com.google.protobuf.util.Timestamps;
import java.util.Queue;

@Service
@Slf4j
@RequiredArgsConstructor
public class MatchingService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String MATCHING_TOPIC = "rider-driver-match";

    private final RedisTemplate<String, Object> redisDriverTemplate;
    private static final String MATCHING_DRIVER_CACHE_KEY = "driver-cache";
    private final RedisTemplate<String, Object> redisWaitingQueueTemplate;
    private static final String MATCHING_WAITING_QUEUE_KEY = "rider-waiting-queue";

    @KafkaListener(topics = "driver-updates", groupId = "matching-service")
    public void driverInfoUpdateCache(Long driverId, String oldStation, String nextStation,
                                      Duration timeToNextStation, Integer availableSeats,
                                      String finalDestination) {
        // Update in Redis cache
        // Remove from old station
        Map<String, Map<String, List<MatchingDriverCache>>> allMatchingCache =
                (Map<String, Map<String, List<MatchingDriverCache>>>) redisDriverTemplate.opsForValue().get(MATCHING_DRIVER_CACHE_KEY);
        Map<String, List<MatchingDriverCache>> matchingCache = allMatchingCache.get(oldStation);
        List<MatchingDriverCache> matchingDriverCacheList = matchingCache.get(finalDestination);
        matchingDriverCacheList.removeIf(matchingDriverCache1 -> matchingDriverCache1.getDriverId().equals(driverId));
        redisDriverTemplate.opsForValue().set(MATCHING_DRIVER_CACHE_KEY, allMatchingCache);

        // Add in new station
        if (!finalDestination.isEmpty()) {
            Map<String, List<MatchingDriverCache>> matchingCache1 = allMatchingCache.get(nextStation);
            List<MatchingDriverCache> matchingDriverCacheList1 = matchingCache.get(finalDestination);
            matchingDriverCacheList1.add(MatchingDriverCache.builder()
                            .driverId(driverId)
                            .timeToReachStation(timeToNextStation)
                            .availableSeats(availableSeats)
                            .build()
            );
            redisDriverTemplate.opsForValue().set(MATCHING_DRIVER_CACHE_KEY, allMatchingCache);
        }
    }

    @KafkaListener(topics = "rider-requests", groupId = "matching-service")
    public void riderInfoDriverMatchingAlgorithm(Long riderId, String pickUpStation,
                                                 com.google.protobuf.Timestamp arrivalTime,
                                                 String destinationPlace,
                                                 Acknowledgment acknowledgment) {
        acknowledgment.acknowledge();
        // Write the matching algorithm and remove that driver, from the Redis cache, that has matched with the rider

        // Write the Kafka producer in case of a match
        DriverRiderMatchEvent driverRiderMatchEvent = DriverRiderMatchEvent.newBuilder()
                .setDriverId(1)
                .setRiderId(riderId)
                .setPickUpStation(pickUpStation)
                .setDriverArrivalTime(arrivalTime)
                .build();

        kafkaTemplate.send(MATCHING_TOPIC, driverRiderMatchEvent);

        // Push the rider in the waiting queue if a driver is currently not available
        Queue<RiderWaitingQueueCache> riderWaitingQueueCache =
                (Queue<RiderWaitingQueueCache>) redisWaitingQueueTemplate.opsForValue().get(MATCHING_WAITING_QUEUE_KEY);
        riderWaitingQueueCache.add(RiderWaitingQueueCache.builder()
                        .riderId(riderId)
                        .arrivalTime(Timestamps.fromMillis(System.currentTimeMillis())) // We assume that the rider has already arrived at the pickup spot
                        .destinationPlace(destinationPlace)
                        .pickUpStation(pickUpStation)
                        .build()
        );
        redisWaitingQueueTemplate.opsForValue().set(MATCHING_WAITING_QUEUE_KEY, riderWaitingQueueCache);
    }

    @Scheduled(cron = "* * * * * *")
    public void cronJobMatchingAlgorithm() {
        // Run this CRON job every second to check whether there is a driver for the riders in the waiting queue => pop the first element from the queue
        // Write the matching algorithm
        // Write the Kafka producer logic here after matching
        DriverRiderMatchEvent driverRiderMatchEvent = DriverRiderMatchEvent.newBuilder()
                .setDriverId(1)
                .setRiderId(0)
                .setPickUpStation("")
                .setDriverArrivalTime(Timestamp.newBuilder()
                        .setSeconds(1)
                        .setNanos(0)
                        .build())
                .build();

        kafkaTemplate.send(MATCHING_TOPIC, driverRiderMatchEvent);
    }
}
