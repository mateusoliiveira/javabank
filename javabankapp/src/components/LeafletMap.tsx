import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface LeafletMapProps {
  latitude: string;
  longitude: string;
  radius: string;
  onLocationSelect: (lat: string, lng: string) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({ latitude, longitude, radius, onLocationSelect }) => {
  const webViewRef = useRef<WebView>(null);

  const defaultLat = latitude ? parseFloat(latitude) : -23.5505;
  const defaultLng = longitude ? parseFloat(longitude) : -46.6333;
  const defaultRadius = (radius ? parseFloat(radius) : 1.0) * 1000;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        var map = L.map('map').setView([${defaultLat}, ${defaultLng}], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        var marker = L.marker([${defaultLat}, ${defaultLng}]).addTo(map);
        
        var circle = L.circle([${defaultLat}, ${defaultLng}], {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            radius: ${defaultRadius}
        }).addTo(map);

        map.on('click', function(e) {
            var lat = e.latlng.lat;
            var lng = e.latlng.lng;
            marker.setLatLng([lat, lng]);
            circle.setLatLng([lat, lng]);
            window.ReactNativeWebView.postMessage(JSON.stringify({ lat: lat, lng: lng }));
        });

        function handleMessage(event) {
            try {
                var data = JSON.parse(event.data);
                if(data.lat !== undefined && data.lng !== undefined) {
                    var newLatLng = new L.LatLng(data.lat, data.lng);
                    marker.setLatLng(newLatLng);
                    circle.setLatLng(newLatLng);
                    map.setView(newLatLng, 15);
                }
                if(data.radius !== undefined) {
                    var newRadius = parseFloat(data.radius) * 1000;
                    if(!isNaN(newRadius)) {
                        circle.setRadius(newRadius);
                    }
                }
            } catch(err) {}
        }
        document.addEventListener('message', handleMessage);
        window.addEventListener('message', handleMessage);
    </script>
</body>
</html>
  `;

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        lat: latitude ? parseFloat(latitude) : undefined,
        lng: longitude ? parseFloat(longitude) : undefined,
        radius: radius ? parseFloat(radius) : undefined
      }));
    }
  }, [latitude, longitude, radius]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.lat !== undefined && data.lng !== undefined) {
              onLocationSelect(data.lat.toString(), data.lng.toString());
            }
          } catch (err) {}
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginVertical: 12,
  },
});
