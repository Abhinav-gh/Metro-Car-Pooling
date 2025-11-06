package com.metrocarpool.contracts.kafka_shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverRideCompletionDriverToTrip {
    private Long driverId;
}
