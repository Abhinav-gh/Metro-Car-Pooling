package com.metrocarpool.trip.cache;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Data
@Getter
@Setter
@Builder
public class TripCache {
    private Long riderId;
    private String pickUpStation;
}
