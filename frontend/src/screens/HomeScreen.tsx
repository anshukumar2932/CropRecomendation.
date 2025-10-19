import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Card, Button, Surface} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import {useTheme} from '../context/ThemeContext';
import ApiService, {HealthResponse} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const health = await ApiService.getHealthCheck();
      setHealthStatus(health);
    } catch (error) {
      console.error('Health check failed:', error);
      // Set a default offline status instead of showing alert
      setHealthStatus({
        status: 'offline',
        crop_model_loaded: false,
        soil_model_loaded: false,
        features: [],
        weather_module: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      title: 'Crop Prediction',
      description: 'Get AI-powered crop recommendations based on soil and weather conditions',
      icon: 'agriculture',
      color: theme.colors.primary,
      screen: 'Crop Prediction',
    },
    {
      title: 'Soil Detection',
      description: 'Identify soil type using advanced image recognition technology',
      icon: 'terrain',
      color: theme.colors.secondary,
      screen: 'Soil Detection',
    },
    {
      title: 'Water Forecast',
      description: 'Analyze water scarcity and get irrigation recommendations',
      icon: 'water',
      color: theme.colors.tertiary,
      screen: 'Water Forecast',
    },
  ];

  if (isLoading) {
    return <LoadingSpinner message="Checking system status..." />;
  }

  return (
    <ScrollView 
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      showsVerticalScrollIndicator={false}
    >
      <Animatable.View animation="fadeInUp" duration={800}>
        <Surface style={[styles.header, {backgroundColor: theme.colors.primaryContainer}]}>
          <Text variant="headlineMedium" style={[styles.title, {color: theme.colors.onPrimaryContainer}]}>
            🌱 AgriTech Assistant
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, {color: theme.colors.onPrimaryContainer}]}>
            Smart farming solutions powered by AI
          </Text>
        </Surface>
      </Animatable.View>

      {healthStatus && (
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <Card style={[styles.statusCard, {
            backgroundColor: healthStatus.status === 'healthy' 
              ? theme.colors.secondaryContainer 
              : theme.colors.errorContainer
          }]}>
            <Card.Content style={styles.statusContent}>
              <MaterialIcons 
                name={healthStatus.status === 'healthy' ? 'check-circle' : 'error'} 
                size={24} 
                color={healthStatus.status === 'healthy' 
                  ? theme.colors.onSecondaryContainer 
                  : theme.colors.onErrorContainer
                }
              />
              <View style={styles.statusText}>
                <Text variant="titleSmall" style={{
                  color: healthStatus.status === 'healthy' 
                    ? theme.colors.onSecondaryContainer 
                    : theme.colors.onErrorContainer
                }}>
                  System Status: {healthStatus.status === 'healthy' ? 'Online' : 'Offline'}
                </Text>
                <Text variant="bodySmall" style={{
                  color: healthStatus.status === 'healthy' 
                    ? theme.colors.onSecondaryContainer 
                    : theme.colors.onErrorContainer
                }}>
                  Models: {healthStatus.crop_model_loaded ? '✓' : '✗'} Crop, {healthStatus.soil_model_loaded ? '✓' : '✗'} Soil
                </Text>
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>
      )}

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Animatable.View 
            key={feature.title}
            animation="fadeInUp" 
            duration={800} 
            delay={300 + (index * 100)}
          >
            <Card style={styles.featureCard} onPress={() => navigation.navigate(feature.screen)}>
              <Card.Content style={styles.featureContent}>
                <View style={[styles.iconContainer, {backgroundColor: `${feature.color}20`}]}>
                  <MaterialIcons name={feature.icon as any} size={32} color={feature.color} />
                </View>
                <View style={styles.featureText}>
                  <Text variant="titleMedium" style={styles.featureTitle}>
                    {feature.title}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.featureDescription, {color: theme.colors.onSurfaceVariant}]}>
                    {feature.description}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
              </Card.Content>
            </Card>
          </Animatable.View>
        ))}
      </View>

      <Animatable.View animation="fadeInUp" duration={800} delay={600}>
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.quickActionsTitle}>
              Quick Actions
            </Text>
            <View style={styles.quickActions}>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('CropsList')}
                icon="format-list-bulleted"
                style={styles.quickActionButton}
              >
                View All Crops
              </Button>
              <Button
                mode="outlined"
                onPress={checkBackendHealth}
                icon="refresh"
                style={styles.quickActionButton}
              >
                Refresh Status
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  statusCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 12,
    flex: 1,
  },
  featuresContainer: {
    paddingHorizontal: 16,
  },
  featureCard: {
    marginBottom: 12,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    marginBottom: 4,
  },
  featureDescription: {
    lineHeight: 20,
  },
  quickActionsCard: {
    margin: 16,
    marginTop: 8,
  },
  quickActionsTitle: {
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
  },
});

export default HomeScreen;