package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;

@Configuration
@EnableMongoRepositories(basePackages = "com.example.backend.repository")
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database}")
    private String database;

    @PostConstruct
    public void init() {
        System.out.println("✅ MongoDB 연결 시도 - URI: " + mongoUri);
        try {
            MongoClient mongoClient = MongoClients.create(mongoUri);
            mongoClient.listDatabaseNames().first();
            System.out.println("✅ MongoDB 연결 성공!");
        } catch (Exception e) {
            System.err.println("❌ MongoDB 연결 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    protected String getDatabaseName() {
        return database;
    }

    @Override
    public MongoClient mongoClient() {
        return MongoClients.create(mongoUri);
    }
}