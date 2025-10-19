import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Card, TextInput, Button, HelperText, Chip} from 'react-native-paper';
import {useTheme} from '../context/ThemeContext';
import LocationInput from '../components/LocationInput';
import LoadingSpinner from '../components/LoadingSpinner';
import ApiService, {WaterScarcityRequest} from '../services/api';
import {LocationCoords} from '../services/location';

interface WaterForecastScreenProps {
  navigation: any;
}

const WaterForecastScreen: React.FC<WaterForecastScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [months, setMonths] = useState('12');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const monthPresets = [3, 6, 12, 24];

  const validateInputs = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!location) {
      newErrors.location = 'Location is required';
    }
    
    const monthsNum = Number(months);
    if (isNaN(monthsNum) || monthsNum < 1 || monthsNum > 60) {
      newErrors.months = 'Months must be between 1 and 60';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForecast = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const requestData: WaterScarcityRequest = {
        latitude: location!.latitude,
        longitude: location!.longitude,
        months: Number(months),
      };

      const result = await ApiService.getWaterScarcityAnalysis(requestData);
      
      navigation.navigate('Result', {
        type: 'water',
        data: result,
      });
    } catch (error: any) {
      Alert.alert(
        'Forecast Failed',
        error.response?.data?.detail || error.message || 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const setMonthsPreset = (value: number) => {
    setMonths(value.toString());
  };

  if (isLoading) {
    return <LoadingSpinner message="Generating water scarcity forecast..." />;
  }

  return (
    <ScrollView 
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="headlineSmall" style={styles.title}>
        💧 Water Scarcity Forecast
      </Text>
      <Text variant="bodyMedium" style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
        Analyze water availability and get recommendations for sustainable farming practices.
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
            📅 Forecast Period
          </Text>
          
          <TextInput
            label="Number of Months"
            value={months}
            onChangeText={setMonths}
            keyboardType="numeric"
            error={!!errors.months}
            style={styles.input}
            right={<TextInput.Affix text="months" />}
          />
          <HelperText type="error" visible={!!errors.months}>
            {errors.months}
          </HelperText>
          
          <Text variant="bodySmall" style={[styles.presetsLabel, {color: theme.colors.onSurfaceVariant}]}>
            Quick select:
          </Text>
          <View style={styles.presets}>
            {monthPresets.map((preset) => (
              <Chip
                key={preset}
                selected={months === preset.toString()}
                onPress={() => setMonthsPreset(preset)}
                style={styles.presetChip}
              >
                {preset} months
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.infoTitle}>
            📊 What You'll Get
          </Text>
          <View style={styles.infoList}>
            <Text variant="bodyMedium" style={styles.infoItem}>
              • Water scarcity risk level (High/Medium/Low)
            </Text>
            <Text variant="bodyMedium" style={styles.infoItem}>
              • Months with potential water shortage
            </Text>
            <Text variant="bodyMedium" style={styles.infoItem}>
              • Crop recommendations based on water availability
            </Text>
            <Text variant="bodyMedium" style={styles.infoItem}>
              • Water conservation strategies
            </Text>
            <Text variant="bodyMedium" style={styles.infoItem}>
              • Weather forecast summary
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.tipsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.tipsTitle}>
            💡 Water Management Tips
          </Text>
          <View style={styles.tipsList}>
            <View style={[styles.tip, {backgroundColor: theme.colors.primaryContainer}]}>
              <Text variant="labelMedium" style={[styles.tipLabel, {color: theme.colors.onPrimaryContainer}]}>
                LOW WATER CROPS
              </Text>
              <Text variant="bodySmall" style={[styles.tipText, {color: theme.colors.onPrimaryContainer}]}>
                Chickpea, Lentil, Mustard, Sunflower
              </Text>
            </View>
            <View style={[styles.tip, {backgroundColor: theme.colors.secondaryContainer}]}>
              <Text variant="labelMedium" style={[styles.tipLabel, {color: theme.colors.onSecondaryContainer}]}>
                WATER CONSERVATION
              </Text>
              <Text variant="bodySmall" style={[styles.tipText, {color: theme.colors.onSecondaryContainer}]}>
                Drip irrigation, Mulching, Rainwater harvesting
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleForecast}
        disabled={!location}
        style={styles.forecastButton}
        contentStyle={styles.forecastButtonContent}
      >
        Generate Water Forecast
      </Button>
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
  input: {
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  presetsLabel: {
    marginTop: 8,
    marginBottom: 8,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    marginBottom: 4,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoTitle: {
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    lineHeight: 20,
  },
  tipsCard: {
    marginBottom: 24,
  },
  tipsTitle: {
    marginBottom: 12,
  },
  tipsList: {
    gap: 12,
  },
  tip: {
    padding: 12,
    borderRadius: 8,
  },
  tipLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipText: {
    lineHeight: 16,
  },
  forecastButton: {
    marginBottom: 32,
  },
  forecastButtonContent: {
    paddingVertical: 8,
  },
  errorText: {
    marginTop: -8,
    marginBottom: 16,
  },
});

export default WaterForecastScreen;