package com.metrocarpool.contracts.kafka_shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RiderInfoRiderToMatching {
    private Long riderId;
    private String pickUpStation;
    private com.google.protobuf.Timestamp arrivalTime;
    private String destinationPlace;
}
