import * as Location from 'expo-location';
import {Alert} from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

class LocationService {
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationCoords> {
    const hasPermission = await this.requestLocationPermission();
    
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 15000,
        distanceInterval: 10,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Location error:', error);
      throw new Error('Failed to get current location');
    }
  }

  showLocationError() {
    Alert.alert(
      'Location Error',
      'Unable to get your current location. Please check your GPS settings and try again, or enter coordinates manually.',
      [
        {text: 'OK', style: 'default'},
      ]
    );
  }
}

export default new LocationService();