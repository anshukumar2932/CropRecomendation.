import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert, Image} from 'react-native';
import {Text, Card, Button} from 'react-native-paper';
import {useTheme} from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ApiService from '../services/api';
import ImageService from '../services/imageService';

interface SoilDetectionScreenProps {
  navigation: any;
}

const SoilDetectionScreen: React.FC<SoilDetectionScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSoilDetection = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select a soil image first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await ApiService.predictSoil(selectedImage);
      
      navigation.navigate('Result', {
        type: 'soil',
        data: result,
      });
    } catch (error: any) {
      Alert.alert(
        'Detection Failed',
        error.response?.data?.detail || error.message || 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Analyzing soil image..." />;
  }

  return (
    <ScrollView 
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="headlineSmall" style={styles.title}>
        🏞️ Soil Type Detection
      </Text>
      <Text variant="bodyMedium" style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
        Upload a clear image of your soil to identify its type using AI-powered image recognition.
      </Text>

      <Card style={styles.instructionsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.instructionsTitle}>
            📸 Photo Guidelines
          </Text>
          <View style={styles.instructionsList}>
            <Text variant="bodyMedium" style={styles.instruction}>
              • Take a clear, well-lit photo of the soil surface
            </Text>
            <Text variant="bodyMedium" style={styles.instruction}>
              • Remove any debris, leaves, or stones
            </Text>
            <Text variant="bodyMedium" style={styles.instruction}>
              • Ensure the soil fills most of the frame
            </Text>
            <Text variant="bodyMedium" style={styles.instruction}>
              • Avoid shadows and reflections
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.imageCard}>
        <Card.Content>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{uri: selectedImage}} style={styles.selectedImage} />
              <View style={styles.imageActions}>
                <Button
                  mode="outlined"
                  onPress={handleImagePicker}
                  style={styles.changeImageButton}
                >
                  Change Image
                </Button>
                <Button
                  mode="text"
                  onPress={() => setSelectedImage(null)}
                  textColor={theme.colors.error}
                >
                  Remove
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={[styles.placeholder, {borderColor: theme.colors.outline}]}>
                <Text variant="headlineLarge" style={styles.placeholderIcon}>
                  📷
                </Text>
                <Text variant="titleMedium" style={styles.placeholderText}>
                  No image selected
                </Text>
                <Text variant="bodyMedium" style={[styles.placeholderSubtext, {color: theme.colors.onSurfaceVariant}]}>
                  Tap the button below to select a soil image
                </Text>
              </View>
            </View>
          )}
          
          <Button
            mode="contained"
            onPress={handleImagePicker}
            icon="camera"
            style={styles.selectButton}
          >
            {selectedImage ? 'Select Different Image' : 'Select Soil Image'}
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.soilTypesCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.soilTypesTitle}>
            🌍 Detectable Soil Types
          </Text>
          <View style={styles.soilTypesList}>
            {['Black Soil', 'Cinder Soil', 'Laterite Soil', 'Peat Soil', 'Yellow Soil'].map((soilType) => (
              <View key={soilType} style={[styles.soilTypeItem, {backgroundColor: theme.colors.surfaceVariant}]}>
                <Text variant="bodyMedium">{soilType}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSoilDetection}
        disabled={!selectedImage}
        style={styles.detectButton}
        contentStyle={styles.detectButtonContent}
      >
        Detect Soil Type
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
  instructionsCard: {
    marginBottom: 16,
  },
  instructionsTitle: {
    marginBottom: 12,
  },
  instructionsList: {
    gap: 8,
  },
  instruction: {
    lineHeight: 20,
  },
  imageCard: {
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  changeImageButton: {
    flex: 1,
  },
  placeholderContainer: {
    marginBottom: 16,
  },
  placeholder: {
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderIcon: {
    marginBottom: 8,
  },
  placeholderText: {
    marginBottom: 4,
  },
  placeholderSubtext: {
    textAlign: 'center',
  },
  selectButton: {
    marginTop: 8,
  },
  soilTypesCard: {
    marginBottom: 24,
  },
  soilTypesTitle: {
    marginBottom: 12,
  },
  soilTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  soilTypeItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detectButton: {
    marginBottom: 32,
  },
  detectButtonContent: {
    paddingVertical: 8,
  },
});

export default SoilDetectionScreen;