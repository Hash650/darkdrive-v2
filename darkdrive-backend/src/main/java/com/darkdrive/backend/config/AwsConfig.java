package com.darkdrive.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.beans.factory.annotation.Value;

import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

    @Value("${aws.region}")
    private String awsRegion;

    @Bean
    public S3Client s3Client()
    {
        return S3Client.builder().region(Region.of(awsRegion)).httpClientBuilder(ApacheHttpClient.builder()).build();
    }
    
}
