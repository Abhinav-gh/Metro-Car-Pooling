package com.metrocarpool.matching.cache;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MatchingDriverCache {
    private Long driverId;
    private Duration timeToReachStation;
    private Integer availableSeats;
}
