import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button, Text, Card, HelperText} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import LocationService, {LocationCoords} from '../services/location';

interface LocationInputProps {
  onLocationChange: (coords: LocationCoords) => void;
  initialLocation?: LocationCoords;
}

const LocationInput: React.FC<LocationInputProps> = ({
  onLocationChange,
  initialLocation,
}) => {
  const {theme} = useTheme();
  const [latitude, setLatitude] = useState(
    initialLocation?.latitude?.toString() || ''
  );
  const [longitude, setLongitude] = useState(
    initialLocation?.longitude?.toString() || ''
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [errors, setErrors] = useState({latitude: '', longitude: ''});

  const validateCoordinates = () => {
    const newErrors = {latitude: '', longitude: ''};
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    
    if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }
    
    setErrors(newErrors);
    
    if (!newErrors.latitude && !newErrors.longitude) {
      onLocationChange({latitude: lat, longitude: lng});
    }
    
    return !newErrors.latitude && !newErrors.longitude;
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const coords = await LocationService.getCurrentLocation();
      setLatitude(coords.latitude.toString());
      setLongitude(coords.longitude.toString());
      onLocationChange(coords);
      setErrors({latitude: '', longitude: ''});
    } catch (error) {
      LocationService.showLocationError();
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          📍 Location
        </Text>
        
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Latitude"
              value={latitude}
              onChangeText={setLatitude}
              onBlur={validateCoordinates}
              keyboardType="numeric"
              error={!!errors.latitude}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.latitude}>
              {errors.latitude}
            </HelperText>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              label="Longitude"
              value={longitude}
              onChangeText={setLongitude}
              onBlur={validateCoordinates}
              keyboardType="numeric"
              error={!!errors.longitude}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.longitude}>
              {errors.longitude}
            </HelperText>
          </View>
        </View>
        
        <Button
          mode="outlined"
          onPress={getCurrentLocation}
          loading={isGettingLocation}
          disabled={isGettingLocation}
          icon={({size, color}) => (
            <MaterialIcons name="my-location" size={size} color={color} />
          )}
          style={styles.locationButton}
        >
          {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: 'transparent',
  },
  locationButton: {
    marginTop: 8,
  },
});

export default LocationInput;