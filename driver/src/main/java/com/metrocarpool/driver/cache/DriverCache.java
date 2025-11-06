package com.metrocarpool.driver.cache;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DriverCache {
    private Integer availableSeats;
    private List<String> routeStations;
    private String nextStation;
    private Duration timeToNextStation;
    private String finalDestination;
}
