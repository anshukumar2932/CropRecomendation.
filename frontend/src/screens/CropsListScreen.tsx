import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Card, Searchbar, Chip, Surface} from 'react-native-paper';
import {useTheme} from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ApiService, {CropInfo} from '../services/api';

interface CropsListScreenProps {
  navigation: any;
}

const CropsListScreen: React.FC<CropsListScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const [crops, setCrops] = useState<CropInfo[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<CropInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWaterFilter, setSelectedWaterFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const waterRequirements = ['Low Water', 'Medium Water', 'High Water', 'Very High Water'];

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [crops, searchQuery, selectedWaterFilter]);

  const loadCrops = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ApiService.getAvailableCrops();
      setCrops(response.crops);
    } catch (error: any) {
      setError(error.response?.data?.detail || error.message || 'Failed to load crops');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCrops = () => {
    let filtered = crops;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(crop =>
        crop.crop.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by water requirement
    if (selectedWaterFilter) {
      filtered = filtered.filter(crop => crop.water_requirement === selectedWaterFilter);
    }

    setFilteredCrops(filtered);
  };

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

  const getWaterRequirementIcon = (requirement: string) => {
    switch (requirement) {
      case 'Low Water':
        return '🌵';
      case 'Medium Water':
        return '🌾';
      case 'High Water':
        return '🌿';
      case 'Very High Water':
        return '💧';
      default:
        return '🌱';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedWaterFilter(null);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading available crops..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadCrops} />;
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Surface style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <Text variant="headlineSmall" style={styles.title}>
          🌾 Available Crops
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
          {crops.length} crops available for prediction
        </Text>
      </Surface>

      <View style={styles.filtersContainer}>
        <Searchbar
          placeholder="Search crops..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterChips}
          contentContainerStyle={styles.filterChipsContent}
        >
          <Chip
            selected={selectedWaterFilter === null}
            onPress={() => setSelectedWaterFilter(null)}
            style={styles.filterChip}
          >
            All ({crops.length})
          </Chip>
          {waterRequirements.map((requirement) => {
            const count = crops.filter(crop => crop.water_requirement === requirement).length;
            return (
              <Chip
                key={requirement}
                selected={selectedWaterFilter === requirement}
                onPress={() => setSelectedWaterFilter(requirement)}
                style={[
                  styles.filterChip,
                  selectedWaterFilter === requirement && {
                    backgroundColor: getWaterRequirementColor(requirement),
                  }
                ]}
                textStyle={selectedWaterFilter === requirement ? {color: 'white'} : undefined}
              >
                {getWaterRequirementIcon(requirement)} {requirement} ({count})
              </Chip>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.cropsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredCrops.length === 0 ? (
          <Card style={styles.noCropsCard}>
            <Card.Content style={styles.noCropsContent}>
              <Text variant="titleMedium" style={styles.noCropsTitle}>
                No crops found
              </Text>
              <Text variant="bodyMedium" style={[styles.noCropsText, {color: theme.colors.onSurfaceVariant}]}>
                {searchQuery || selectedWaterFilter 
                  ? 'Try adjusting your search or filters'
                  : 'No crops available'
                }
              </Text>
              {(searchQuery || selectedWaterFilter) && (
                <Text 
                  variant="bodyMedium" 
                  style={[styles.clearFiltersText, {color: theme.colors.primary}]}
                  onPress={clearFilters}
                >
                  Clear filters
                </Text>
              )}
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.cropsGrid}>
            {filteredCrops.map((crop, index) => (
              <Card key={`${crop.crop}-${index}`} style={styles.cropCard}>
                <Card.Content style={styles.cropContent}>
                  <Text variant="titleMedium" style={styles.cropName}>
                    {crop.crop}
                  </Text>
                  <Chip 
                    style={[
                      styles.waterChip,
                      {backgroundColor: getWaterRequirementColor(crop.water_requirement)}
                    ]}
                    textStyle={{color: 'white', fontSize: 11}}
                    compact
                  >
                    {getWaterRequirementIcon(crop.water_requirement)} {crop.water_requirement}
                  </Chip>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <Surface style={[styles.footer, {backgroundColor: theme.colors.surface}]}>
        <Text variant="bodySmall" style={[styles.footerText, {color: theme.colors.onSurfaceVariant}]}>
          Showing {filteredCrops.length} of {crops.length} crops
        </Text>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.8,
  },
  filtersContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    marginBottom: 12,
  },
  filterChips: {
    marginBottom: 8,
  },
  filterChipsContent: {
    paddingRight: 16,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  cropsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 16,
  },
  cropCard: {
    width: '48%',
    minHeight: 80,
  },
  cropContent: {
    padding: 12,
    alignItems: 'center',
  },
  cropName: {
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  waterChip: {
    alignSelf: 'center',
  },
  noCropsCard: {
    marginTop: 32,
  },
  noCropsContent: {
    alignItems: 'center',
    padding: 24,
  },
  noCropsTitle: {
    marginBottom: 8,
  },
  noCropsText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersText: {
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default CropsListScreen;