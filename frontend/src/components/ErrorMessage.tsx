import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button, Card} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  retryText = 'Try Again',
}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <Card style={[styles.card, {backgroundColor: theme.colors.errorContainer}]}>
        <Card.Content style={styles.content}>
          <MaterialIcons 
            name="error-outline" 
            size={48} 
            color={theme.colors.onErrorContainer}
            style={styles.icon}
          />
          <Text 
            variant="titleMedium" 
            style={[styles.title, {color: theme.colors.onErrorContainer}]}
          >
            Something went wrong
          </Text>
          <Text 
            variant="bodyMedium" 
            style={[styles.message, {color: theme.colors.onErrorContainer}]}
          >
            {message}
          </Text>
          {onRetry && (
            <Button
              mode="contained"
              onPress={onRetry}
              style={styles.button}
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
            >
              {retryText}
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 8,
  },
});

export default ErrorMessage;