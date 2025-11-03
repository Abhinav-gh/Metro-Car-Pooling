package com.metrocarpool.gateway.client;

import com.metrocarpool.user.proto.UserServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.stereotype.Component;

@Component
public class UserGrpcClient {
    private final UserServiceGrpc.UserServiceBlockingStub stub;

    public UserGrpcClient() {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("user-service", 9090).usePlaintext().build();
        stub = UserServiceGrpc.newBlockingStub(channel);
    }
}
