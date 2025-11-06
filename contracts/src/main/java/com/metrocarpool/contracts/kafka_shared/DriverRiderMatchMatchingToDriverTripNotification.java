package com.metrocarpool.contracts.kafka_shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverRiderMatchMatchingToDriverTripNotification {
    private Long driverId;
    private Long riderId;
    private String pickUpStation;
}
