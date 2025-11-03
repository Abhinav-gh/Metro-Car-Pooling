package com.metrocarpool.gateway.client;

import com.metrocarpool.driver.proto.DriverServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.stereotype.Component;

@Component
public class DriverGrpcClient {
    private final DriverServiceGrpc.DriverServiceBlockingStub stub;

    public DriverGrpcClient() {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("driver-service", 9090).usePlaintext().build();
        stub = DriverServiceGrpc.newBlockingStub(channel);
    }
}
