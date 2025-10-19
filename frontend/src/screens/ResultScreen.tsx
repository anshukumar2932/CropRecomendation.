import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Chip, Button, Divider, Surface} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import {PredictionResponse, SoilPredictionResponse, WaterScarcityResponse} from '../services/api';

interface ResultScreenProps {
  navigation: any;
  route: {
    params: {
      type: 'crop' | 'soil' | 'water';
      data: PredictionResponse | SoilPredictionResponse | WaterScarcityResponse;
    };
  };
}

const ResultScreen: React.FC<ResultScreenProps> = ({navigation, route}) => {
  const {theme} = useTheme();
  const {type, data} = route.params;

  const getWaterRequirementColor = (requirement: string) => {
    switch (requirement) {
      case 'Low Water':
        return theme.colors.primary;
      case 'Medium Water':
        return theme.colors.secondary;
      case 'High Water':
        return theme.colors.tertiary;
      case 'Very High Water':
        return theme.colors.error;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const getScarcityLevelColor = (level: string) => {
    switch (level) {
      case 'High':
        return theme.colors.error;
      case 'Medium':
        return theme.colors.tertiary;
      case 'Low':
        return theme.colors.primary;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const renderCropResult = (cropData: PredictionResponse) => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Surface style={[styles.headerSurface, {backgroundColor: theme.colors.primaryContainer}]}>
        <Text variant="headlineSmall" style={[styles.headerTitle, {color: theme.colors.onPrimaryContainer}]}>
          🌾 Crop Recommendation
        </Text>
        <Text variant="titleLarge" style={[styles.predictedCrop, {color: theme.colors.onPrimaryContainer}]}>
          {cropData.predicted_crop}
        </Text>
        <Text variant="bodyLarge" style={[styles.confidence, {color: theme.colors.onPrimaryContainer}]}>
          Confidence: {(cropData.confidence * 100).toFixed(1)}%
        </Text>
      </Surface>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            🏞️ Environmental Conditions
          </Text>
          <View style={styles.conditionsGrid}>
            <View style={styles.conditionItem}>
              <Text variant="labelMedium">Soil Type</Text>
              <Text variant="bodyLarge">{cropData.soil_type}</Text>
            </View>
            <View style={styles.conditionItem}>
              <Text variant="labelMedium">Temperature</Text>
              <Text variant="bodyLarge">{cropData.weather_forecast.temperature.toFixed(1)}°C</Text>
            </View>
            <View style={styles.conditionItem}>
              <Text variant="labelMedium">Humidity</Text>
              <Text variant="bodyLarge">{cropData.weather_forecast.humidity.toFixed(1)}%</Text>
            </View>
            <View style={styles.conditionItem}>
              <Text variant="labelMedium">Rainfall</Text>
              <Text variant="bodyLarge">{cropData.weather_forecast.rainfall.toFixed(1)}mm</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.scarcityHeader}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              💧 Water Scarcity Alert
            </Text>
            <Chip 
              style={[styles.scarcityChip, {backgroundColor: getScarcityLevelColor(cropData.water_scarcity_level)}]}
              textStyle={{color: 'white'}}
            >
              {cropData.water_scarcity_level} Risk
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            🏆 Top 5 Recommendations
          </Text>
          {cropData.top_5_predictions.map((crop, index) => (
            <View key={crop.crop} style={styles.cropItem}>
              <View style={styles.cropRank}>
                <Text variant="labelLarge">{index + 1}</Text>
              </View>
              <View style={styles.cropInfo}>
                <Text variant="bodyLarge" style={styles.cropName}>{crop.crop}</Text>
                <Text variant="bodySmall" style={{color: theme.colors.onSurfaceVariant}}>
                  {(crop.confidence * 100).toFixed(1)}% confidence
                </Text>
              </View>
              <Chip 
                style={{backgroundColor: getWaterRequirementColor(crop.water_requirement)}}
                textStyle={{color: 'white', fontSize: 10}}
                compact
              >
                {crop.water_requirement}
              </Chip>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            💧 Crops by Water Requirement
          </Text>
          {cropData.crops_by_water_requirement.map((group) => (
            <View key={group.water_requirement} style={styles.waterGroup}>
              <Text variant="titleSmall" style={[styles.waterGroupTitle, {color: getWaterRequirementColor(group.water_requirement)}]}>
                {group.water_requirement}
              </Text>
              <View style={styles.cropChips}>
                {group.crops.slice(0, 5).map((crop) => (
                  <Chip 
                    key={crop.crop}
                    style={styles.cropChip}
                    textStyle={{fontSize: 12}}
                    compact
                  >
                    {crop.crop} ({(crop.confidence * 100).toFixed(0)}%)
                  </Chip>
                ))}
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            💡 Recommendations
          </Text>
          {cropData.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendation}>
              <MaterialIcons name="check-circle" size={16} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderSoilResult = (soilData: SoilPredictionResponse) => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Surface style={[styles.headerSurface, {backgroundColor: theme.colors.secondaryContainer}]}>
        <Text variant="headlineSmall" style={[styles.headerTitle, {color: theme.colors.onSecondaryContainer}]}>
          🏞️ Soil Type Detection
        </Text>
        <Text variant="titleLarge" style={[styles.predictedCrop, {color: theme.colors.onSecondaryContainer}]}>
          {soilData.soil_type}
        </Text>
        <Text variant="bodyLarge" style={[styles.confidence, {color: theme.colors.onSecondaryContainer}]}>
          Confidence: {(soilData.confidence * 100).toFixed(1)}%
        </Text>
      </Surface>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            📊 Detection Results
          </Text>
          <Text variant="bodyMedium" style={styles.soilDescription}>
            Your soil has been identified as <Text style={{fontWeight: 'bold'}}>{soilData.soil_type}</Text> with 
            a confidence level of <Text style={{fontWeight: 'bold'}}>{(soilData.confidence * 100).toFixed(1)}%</Text>.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            🌱 Next Steps
          </Text>
          <View style={styles.nextSteps}>
            <Text variant="bodyMedium" style={styles.nextStep}>
              • Use this soil type information for crop prediction
            </Text>
            <Text variant="bodyMedium" style={styles.nextStep}>
              • Consider soil-specific fertilization strategies
            </Text>
            <Text variant="bodyMedium" style={styles.nextStep}>
              • Plan irrigation based on soil water retention
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Crop Prediction')}
            style={styles.nextButton}
          >
            Get Crop Recommendations
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderWaterResult = (waterData: WaterScarcityResponse) => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Surface style={[styles.headerSurface, {backgroundColor: theme.colors.tertiaryContainer}]}>
        <Text variant="headlineSmall" style={[styles.headerTitle, {color: theme.colors.onTertiaryContainer}]}>
          💧 Water Scarcity Forecast
        </Text>
        <View style={styles.scarcityHeader}>
          <Chip 
            style={[styles.scarcityChip, {backgroundColor: getScarcityLevelColor(waterData.water_scarcity_level)}]}
            textStyle={{color: 'white'}}
          >
            {waterData.water_scarcity_level} Risk Level
          </Chip>
        </View>
      </Surface>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            📊 Forecast Summary
          </Text>
          <View style={styles.forecastGrid}>
            <View style={styles.forecastItem}>
              <Text variant="labelMedium">Avg Rainfall</Text>
              <Text variant="bodyLarge">{waterData.forecast_summary.avg_rainfall.toFixed(1)}mm</Text>
            </View>
            <View style={styles.forecastItem}>
              <Text variant="labelMedium">Avg Temperature</Text>
              <Text variant="bodyLarge">{waterData.forecast_summary.avg_temperature.toFixed(1)}°C</Text>
            </View>
            <View style={styles.forecastItem}>
              <Text variant="labelMedium">High Risk Months</Text>
              <Text variant="bodyLarge">{waterData.forecast_summary.total_high_scarcity_months}</Text>
            </View>
            <View style={styles.forecastItem}>
              <Text variant="labelMedium">Medium Risk Months</Text>
              <Text variant="bodyLarge">{waterData.forecast_summary.total_medium_scarcity_months}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {waterData.months_affected.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              ⚠️ Affected Months
            </Text>
            <View style={styles.monthsContainer}>
              {waterData.months_affected.map((month) => (
                <Chip 
                  key={month}
                  style={[styles.monthChip, {backgroundColor: theme.colors.errorContainer}]}
                  textStyle={{color: theme.colors.onErrorContainer}}
                >
                  {month}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            💡 Recommendations
          </Text>
          {waterData.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendation}>
              <MaterialIcons name="water" size={16} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {type === 'crop' && renderCropResult(data as PredictionResponse)}
      {type === 'soil' && renderSoilResult(data as SoilPredictionResponse)}
      {type === 'water' && renderWaterResult(data as WaterScarcityResponse)}
      
      <View style={styles.bottomActions}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Back
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('MainTabs')}
          style={styles.homeButton}
        >
          Home
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSurface: {
    padding: 24,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  predictedCrop: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  confidence: {
    opacity: 0.8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardTitle: {
    marginBottom: 16,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  conditionItem: {
    flex: 1,
    minWidth: '45%',
  },
  scarcityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scarcityChip: {
    marginLeft: 8,
  },
  cropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cropRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontWeight: '500',
  },
  waterGroup: {
    marginBottom: 16,
  },
  waterGroupTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  cropChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cropChip: {
    marginBottom: 4,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationText: {
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  soilDescription: {
    lineHeight: 22,
  },
  nextSteps: {
    marginBottom: 16,
  },
  nextStep: {
    marginBottom: 8,
    lineHeight: 20,
  },
  nextButton: {
    marginTop: 8,
  },
  forecastGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  forecastItem: {
    flex: 1,
    minWidth: '45%',
  },
  monthsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthChip: {
    marginBottom: 4,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  homeButton: {
    flex: 1,
  },
});

export default ResultScreen;