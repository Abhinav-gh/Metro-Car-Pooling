package com.metrocarpool.contracts.kafka_shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverRideCompletionTripToNotification {
    private Long driverId;
    private String status;
}
