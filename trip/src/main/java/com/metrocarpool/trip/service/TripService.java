package com.metrocarpool.trip.service;

import com.metrocarpool.contracts.proto.DriverRideCompletion;
import com.metrocarpool.contracts.proto.RiderRideCompletion;
import com.metrocarpool.trip.cache.TripCache;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.kafka.support.Acknowledgment;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TripService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String DRIVER_RIDE_COMPLETION_TOPIC = "driver-ride-completion";
    private static final String RIDER_RIDE_COMPLETION_TOPIC = "rider-ride-completion";

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String TRIP_CACHE_KEY = "trip-cache";

    @KafkaListener(topics = "rider-driver-match", groupId = "trip-service")
    public void matchFound(Long driverId, Long riderId, String pickUpStation,
                           Acknowledgment acknowledgment) {
        // Acknowledge that we have received the message
        acknowledgment.acknowledge();

        // Update the cache => push this pair {riderId, pickUpStation} in the list associated with key == driverId
        Map<Long, List<TripCache>> allTripCacheData = (Map<Long, List<TripCache>>) redisTemplate.opsForValue().get(TRIP_CACHE_KEY);
        allTripCacheData.get(driverId).add(TripCache.builder()
                        .riderId(riderId)
                        .pickUpStation(pickUpStation)
                        .build()
        );
        redisTemplate.opsForValue().set(TRIP_CACHE_KEY, allTripCacheData);
    }

    @KafkaListener(topics = "trip-completed", groupId = "trip-service")
    public void tripCompleted(Long driverId, Acknowledgment acknowledgment) {
        acknowledgment.acknowledge();
        // Produce a sequence of Kafka events => ride completion for driver and all associated riders
        // For all associated riders, we need to do this by iterating over the List associated with the driver ID.
        // At the end we need to remove this Map<Long, List<TripCache>>, that is, the record corresponding to the driver ID.

        DriverRideCompletion driverRideCompletion = DriverRideCompletion.newBuilder()
                .setDriverId(driverId)
                .setEventMessage("Driver Ride Completed")
                .build();

        kafkaTemplate.send(DRIVER_RIDE_COMPLETION_TOPIC, driverRideCompletion);

        for (int i = 0; i < 5; i++) {
            RiderRideCompletion riderRideCompletion = RiderRideCompletion.newBuilder()
                    .setRiderId(1)
                    .setEventMessage("Rider Ride Completed")
                    .build();

            kafkaTemplate.send(RIDER_RIDE_COMPLETION_TOPIC, riderRideCompletion);
        }
    }
}
