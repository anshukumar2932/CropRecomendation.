import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert, Image} from 'react-native';
import {Text, Card, TextInput, Button, Chip, HelperText} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {useTheme} from '../context/ThemeContext';
import LocationInput from '../components/LocationInput';
import LoadingSpinner from '../components/LoadingSpinner';
import ApiService, {CropPredictionRequest} from '../services/api';
import ImageService from '../services/imageService';
import {LocationCoords} from '../services/location';

interface CropPredictionScreenProps {
  navigation: any;
}

const SOIL_TYPES = ['Black Soil', 'Cinder Soil', 'Laterite Soil', 'Peat Soil', 'Yellow Soil'];

const CropPredictionScreen: React.FC<CropPredictionScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [soilType, setSoilType] = useState('Black Soil');
  const [nutrients, setNutrients] = useState({
    N: '',
    P: '',
    K: '',
    ph: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateInputs = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!location) {
      newErrors.location = 'Location is required';
    }
    
    // Validate nutrients if provided
    if (nutrients.N && (isNaN(Number(nutrients.N)) || Number(nutrients.N) < 0)) {
      newErrors.N = 'Nitrogen must be a positive number';
    }
    if (nutrients.P && (isNaN(Number(nutrients.P)) || Number(nutrients.P) < 0)) {
      newErrors.P = 'Phosphorus must be a positive number';
    }
    if (nutrients.K && (isNaN(Number(nutrients.K)) || Number(nutrients.K) < 0)) {
      newErrors.K = 'Potassium must be a positive number';
    }
    if (nutrients.ph && (isNaN(Number(nutrients.ph)) || Number(nutrients.ph) < 0 || Number(nutrients.ph) > 14)) {
      newErrors.ph = 'pH must be between 0 and 14';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImageService.showImagePicker();
      if (result) {
        setSelectedImage(result.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handlePrediction = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const requestData: CropPredictionRequest = {
        latitude: location!.latitude,
        longitude: location!.longitude,
        soil_type: soilType,
      };

      // Add nutrients if provided
      if (nutrients.N) requestData.N = Number(nutrients.N);
      if (nutrients.P) requestData.P = Number(nutrients.P);
      if (nutrients.K) requestData.K = Number(nutrients.K);
      if (nutrients.ph) requestData.ph = Number(nutrients.ph);

      const result = await ApiService.predictCrop(requestData, selectedImage || undefined);
      
      navigation.navigate('Result', {
        type: 'crop',
        data: result,
      });
    } catch (error: any) {
      Alert.alert(
        'Prediction Failed',
        error.response?.data?.detail || error.message || 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setLocation(null);
    setSoilType('Black Soil');
    setNutrients({N: '', P: '', K: '', ph: ''});
    setSelectedImage(null);
    setErrors({});
  };

  if (isLoading) {
    return <LoadingSpinner message="Analyzing soil and weather conditions..." />;
  }

  return (
    <ScrollView 
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="headlineSmall" style={styles.title}>
        🌾 Crop Prediction
      </Text>
      <Text variant="bodyMedium" style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
        Get AI-powered crop recommendations based on your location, soil conditions, and nutrients.
      </Text>

      <LocationInput
        onLocationChange={setLocation}
        initialLocation={location}
      />
      {errors.location && (
        <HelperText type="error" visible={true} style={styles.errorText}>
          {errors.location}
        </HelperText>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            🏞️ Soil Information
          </Text>
          
          {selectedImage && (
            <View style={styles.imageContainer}>
              <Image source={{uri: selectedImage}} style={styles.selectedImage} />
              <Button
                mode="text"
                onPress={() => setSelectedImage(null)}
                textColor={theme.colors.error}
              >
                Remove Image
              </Button>
            </View>
          )}
          
          <Button
            mode="outlined"
            onPress={handleImagePicker}
            icon="camera"
            style={styles.imageButton}
          >
            {selectedImage ? 'Change Soil Image' : 'Upload Soil Image (Optional)'}
          </Button>
          
          <Text variant="bodyMedium" style={styles.orText}>
            OR select soil type manually:
          </Text>
          
          <View style={styles.pickerContainer}>
            <Text variant="labelLarge" style={styles.pickerLabel}>
              Soil Type
            </Text>
            <Picker
              selectedValue={soilType}
              onValueChange={setSoilType}
              style={[styles.picker, {color: theme.colors.onSurface}]}
            >
              {SOIL_TYPES.map(type => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            🧪 Soil Nutrients (Optional)
          </Text>
          <Text variant="bodySmall" style={[styles.optionalText, {color: theme.colors.onSurfaceVariant}]}>
            Leave empty if you don't have soil test results. The system will use regional averages.
          </Text>
          
          <View style={styles.nutrientRow}>
            <View style={styles.nutrientInput}>
              <TextInput
                label="Nitrogen (N)"
                value={nutrients.N}
                onChangeText={(text) => setNutrients(prev => ({...prev, N: text}))}
                keyboardType="numeric"
                error={!!errors.N}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.N}>
                {errors.N}
              </HelperText>
            </View>
            
            <View style={styles.nutrientInput}>
              <TextInput
                label="Phosphorus (P)"
                value={nutrients.P}
                onChangeText={(text) => setNutrients(prev => ({...prev, P: text}))}
                keyboardType="numeric"
                error={!!errors.P}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.P}>
                {errors.P}
              </HelperText>
            </View>
          </View>
          
          <View style={styles.nutrientRow}>
            <View style={styles.nutrientInput}>
              <TextInput
                label="Potassium (K)"
                value={nutrients.K}
                onChangeText={(text) => setNutrients(prev => ({...prev, K: text}))}
                keyboardType="numeric"
                error={!!errors.K}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.K}>
                {errors.K}
              </HelperText>
            </View>
            
            <View style={styles.nutrientInput}>
              <TextInput
                label="Soil pH"
                value={nutrients.ph}
                onChangeText={(text) => setNutrients(prev => ({...prev, ph: text}))}
                keyboardType="numeric"
                error={!!errors.ph}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.ph}>
                {errors.ph}
              </HelperText>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={clearForm}
          style={styles.clearButton}
        >
          Clear Form
        </Button>
        <Button
          mode="contained"
          onPress={handlePrediction}
          disabled={!location}
          style={styles.predictButton}
        >
          Get Crop Recommendation
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageButton: {
    marginBottom: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  pickerLabel: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  picker: {
    height: 50,
  },
  optionalText: {
    marginBottom: 16,
    fontStyle: 'italic',
  },
  nutrientRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nutrientInput: {
    flex: 1,
  },
  input: {
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  clearButton: {
    flex: 1,
  },
  predictButton: {
    flex: 2,
  },
  errorText: {
    marginTop: -8,
    marginBottom: 16,
  },
});

export default CropPredictionScreen;