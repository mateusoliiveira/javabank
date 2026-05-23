package com.example.javabank.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class IPGeolocationService {
    private final RestTemplate restTemplate;

    public IPGeolocationService() {
        this.restTemplate = new RestTemplate();
    }

    public static class GeoIPResponse {
        private Double lat;
        private Double lon;
        private String status;

        public Double getLat() {
            return lat;
        }

        public void setLat(Double lat) {
            this.lat = lat;
        }

        public Double getLon() {
            return lon;
        }

        public void setLon(Double lon) {
            this.lon = lon;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public GeoIPResponse getGeoIP(String ip) {
        if (ip == null || ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1") || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.16.") || ip.startsWith("172.31.")) {
            GeoIPResponse mock = new GeoIPResponse();
            mock.setLat(-23.5505);
            mock.setLon(-46.6333);
            mock.setStatus("success");
            return mock;
        }

        try {
            String url = "http://ip-api.com/json/" + ip;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && "success".equals(response.get("status"))) {
                GeoIPResponse res = new GeoIPResponse();
                res.setLat(Double.parseDouble(response.get("lat").toString()));
                res.setLon(Double.parseDouble(response.get("lon").toString()));
                res.setStatus("success");
                return res;
            }
        } catch (Exception e) {
            System.err.println("Erro na consulta de IP Geolocation: " + e.getMessage());
        }

        return null;
    }
}
