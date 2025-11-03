package com.metrocarpool.gateway.controller;

import com.metrocarpool.gateway.client.UserGrpcClient;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Builder
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserGrpcClient userGrpcClient;
}
