package com.metrocarpool.driver.grpc;

import com.metrocarpool.driver.proto.DriverServiceGrpc;
import com.metrocarpool.driver.service.DriverService;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.grpc.server.service.GrpcService;

@GrpcService
@Builder
public class DriverGrpcServer extends DriverServiceGrpc.DriverServiceImplBase {
    @Autowired
    private DriverService driverService;
}
