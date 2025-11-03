package com.metrocarpool.gateway.client;

import com.metrocarpool.notification.proto.NotificationServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.stereotype.Component;

@Component
public class NotificationGrpcClient {
    private final NotificationServiceGrpc.NotificationServiceBlockingStub stub;

    public NotificationGrpcClient() {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("notification-service", 9090).usePlaintext().build();
        stub = NotificationServiceGrpc.newBlockingStub(channel);
    }
}
