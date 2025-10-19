import React, {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32',
    primaryContainer: '#A5D6A7',
    secondary: '#4CAF50',
    secondaryContainer: '#C8E6C9',
    tertiary: '#FF9800',
    tertiaryContainer: '#FFE0B2',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#1B5E20',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#2E7D32',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#E65100',
    onSurface: '#212121',
    onSurfaceVariant: '#757575',
    onBackground: '#212121',
    onError: '#FFFFFF',
    onErrorContainer: '#B71C1C',
    outline: '#E0E0E0',
    outlineVariant: '#EEEEEE',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#303030',
    inverseOnSurface: '#F5F5F5',
    inversePrimary: '#81C784',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#81C784',
    primaryContainer: '#2E7D32',
    secondary: '#A5D6A7',
    secondaryContainer: '#388E3C',
    tertiary: '#FFB74D',
    tertiaryContainer: '#F57C00',
    surface: '#121212',
    surfaceVariant: '#1E1E1E',
    background: '#0A0A0A',
    error: '#F44336',
    errorContainer: '#B71C1C',
    onPrimary: '#1B5E20',
    onPrimaryContainer: '#C8E6C9',
    onSecondary: '#2E7D32',
    onSecondaryContainer: '#E8F5E8',
    onTertiary: '#E65100',
    onTertiaryContainer: '#FFF3E0',
    onSurface: '#E0E0E0',
    onSurfaceVariant: '#BDBDBD',
    onBackground: '#E0E0E0',
    onError: '#FFFFFF',
    onErrorContainer: '#FFCDD2',
    outline: '#424242',
    outlineVariant: '#303030',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#E0E0E0',
    inverseOnSurface: '#303030',
    inversePrimary: '#2E7D32',
  },
};

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: typeof lightTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  
  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';
    
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedMode = await SecureStore.getItemAsync('themeMode');
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme mode:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await SecureStore.setItemAsync('themeMode', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{theme, themeMode, setThemeMode, isDark}}>
      {children}
    </ThemeContext.Provider>
  );
};