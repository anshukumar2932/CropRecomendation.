import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert, Linking} from 'react-native';
import {Text, Card, List, Switch, Button, Divider, Surface} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';
import ApiService from '../services/api';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const {theme, themeMode, setThemeMode, isDark} = useTheme();
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
  };

  const checkBackendHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const health = await ApiService.getHealthCheck();
      Alert.alert(
        'Backend Status',
        `Status: ${health.status}\n` +
        `Crop Model: ${health.crop_model_loaded ? 'Loaded' : 'Not Loaded'}\n` +
        `Soil Model: ${health.soil_model_loaded ? 'Loaded' : 'Not Loaded'}\n` +
        `Features: ${health.features.length} available\n` +
        `Weather Module: ${health.weather_module ? 'Active' : 'Inactive'}`,
        [{text: 'OK'}]
      );
    } catch (error: any) {
      Alert.alert(
        'Backend Error',
        'Unable to connect to the backend server. Please check your internet connection and server status.',
        [{text: 'OK'}]
      );
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const openGitHub = () => {
    Linking.openURL('https://github.com/your-repo/agritech-app');
  };

  const openDocumentation = () => {
    Linking.openURL('https://your-docs-site.com');
  };

  const showAbout = () => {
    Alert.alert(
      'About AgriTech Assistant',
      'Version 1.0.0\n\n' +
      'AgriTech Assistant is an AI-powered mobile application that helps farmers make informed decisions about crop selection, soil management, and water conservation.\n\n' +
      'Features:\n' +
      '• Crop recommendation based on soil and weather\n' +
      '• Soil type detection using image recognition\n' +
      '• Water scarcity forecasting\n' +
      '• Sustainable farming recommendations',
      [{text: 'OK'}]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      showsVerticalScrollIndicator={false}
    >
      <Surface style={[styles.header, {backgroundColor: theme.colors.primaryContainer}]}>
        <Text variant="headlineSmall" style={[styles.title, {color: theme.colors.onPrimaryContainer}]}>
          ⚙️ Settings
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, {color: theme.colors.onPrimaryContainer}]}>
          Customize your AgriTech experience
        </Text>
      </Surface>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            🎨 Appearance
          </Text>
          
          <List.Item
            title="Light Theme"
            description="Use light colors"
            left={() => <MaterialIcons name="light-mode" size={24} color={theme.colors.onSurface} />}
            right={() => (
              <Switch
                value={themeMode === 'light'}
                onValueChange={() => handleThemeChange('light')}
              />
            )}
            onPress={() => handleThemeChange('light')}
          />
          
          <List.Item
            title="Dark Theme"
            description="Use dark colors"
            left={() => <MaterialIcons name="dark-mode" size={24} color={theme.colors.onSurface} />}
            right={() => (
              <Switch
                value={themeMode === 'dark'}
                onValueChange={() => handleThemeChange('dark')}
              />
            )}
            onPress={() => handleThemeChange('dark')}
          />
          
          <List.Item
            title="System Theme"
            description="Follow system settings"
            left={() => <MaterialIcons name="settings-system-daydream" size={24} color={theme.colors.onSurface} />}
            right={() => (
              <Switch
                value={themeMode === 'system'}
                onValueChange={() => handleThemeChange('system')}
              />
            )}
            onPress={() => handleThemeChange('system')}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            🔧 System
          </Text>
          
          <List.Item
            title="Backend Health Check"
            description="Check server connection and model status"
            left={() => <MaterialIcons name="health-and-safety" size={24} color={theme.colors.onSurface} />}
            right={() => <MaterialIcons name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={checkBackendHealth}
            disabled={isCheckingHealth}
          />
          
          <List.Item
            title="View All Crops"
            description="Browse available crop database"
            left={() => <MaterialIcons name="format-list-bulleted" size={24} color={theme.colors.onSurface} />}
            right={() => <MaterialIcons name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={() => navigation.navigate('CropsList')}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📱 App Information
          </Text>
          
          <List.Item
            title="About"
            description="App version and information"
            left={() => <MaterialIcons name="info" size={24} color={theme.colors.onSurface} />}
            right={() => <MaterialIcons name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={showAbout}
          />
          
          <List.Item
            title="Documentation"
            description="User guide and API documentation"
            left={() => <MaterialIcons name="description" size={24} color={theme.colors.onSurface} />}
            right={() => <MaterialIcons name="open-in-new" size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={openDocumentation}
          />
          
          <List.Item
            title="Source Code"
            description="View on GitHub"
            left={() => <MaterialIcons name="code" size={24} color={theme.colors.onSurface} />}
            right={() => <MaterialIcons name="open-in-new" size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={openGitHub}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            🚀 Quick Actions
          </Text>
          
          <View style={styles.quickActions}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Crop Prediction')}
              icon="agriculture"
              style={styles.quickActionButton}
            >
              Predict Crop
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Soil Detection')}
              icon="terrain"
              style={styles.quickActionButton}
            >
              Detect Soil
            </Button>
          </View>
          
          <View style={styles.quickActions}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Water Forecast')}
              icon="water-drop"
              style={styles.quickActionButton}
            >
              Water Forecast
            </Button>
            
            <Button
              mode="outlined"
              onPress={checkBackendHealth}
              icon="refresh"
              loading={isCheckingHealth}
              disabled={isCheckingHealth}
              style={styles.quickActionButton}
            >
              Health Check
            </Button>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={[styles.footerText, {color: theme.colors.onSurfaceVariant}]}>
          AgriTech Assistant v1.0.0
        </Text>
        <Text variant="bodySmall" style={[styles.footerText, {color: theme.colors.onSurfaceVariant}]}>
          Powered by AI for sustainable farming
        </Text>
      </View>
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
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.8,
    textAlign: 'center',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  quickActionButton: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    marginTop: 16,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default SettingsScreen;