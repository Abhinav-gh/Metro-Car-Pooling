package com.metrocarpool.notification.grpc;

import com.metrocarpool.notification.proto.NotificationServiceGrpc;
import com.metrocarpool.notification.service.NotificationService;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.grpc.server.service.GrpcService;

@GrpcService
@Builder
public class NotificationGrpcServer extends NotificationServiceGrpc.NotificationServiceImplBase {
    @Autowired
    private NotificationService notificationService;
}
