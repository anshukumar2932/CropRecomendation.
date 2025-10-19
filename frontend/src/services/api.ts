import axios from 'axios';

// Update this URL to your backend server
const BASE_URL = 'http://192.168.29.21:8000'; // Your network IP for device testing

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CropPredictionRequest {
  N?: number;
  P?: number;
  K?: number;
  ph?: number;
  latitude: number;
  longitude: number;
  soil_type?: string;
}

export interface CropPrediction {
  crop: string;
  confidence: number;
  water_requirement: string;
}

export interface WaterGroup {
  water_requirement: string;
  crops: CropPrediction[];
}

export interface PredictionResponse {
  predicted_crop: string;
  confidence: number;
  water_scarcity_level: string;
  top_5_predictions: CropPrediction[];
  crops_by_water_requirement: WaterGroup[];
  recommendations: string[];
  weather_forecast: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  soil_type: string;
}

export interface SoilPredictionResponse {
  soil_type: string;
  confidence: number;
}

export interface WaterScarcityRequest {
  latitude: number;
  longitude: number;
  months?: number;
}

export interface WaterScarcityResponse {
  water_scarcity_level: string;
  months_affected: string[];
  recommendations: string[];
  forecast_summary: {
    avg_rainfall: number;
    avg_temperature: number;
    total_high_scarcity_months: number;
    total_medium_scarcity_months: number;
  };
}

export interface HealthResponse {
  status: string;
  crop_model_loaded: boolean;
  soil_model_loaded: boolean;
  num_classes?: number;
  features: string[];
  weather_module: boolean;
}

export interface CropInfo {
  crop: string;
  water_requirement: string;
}

class ApiService {
  async predictCrop(
    data: CropPredictionRequest,
    imageUri?: string
  ): Promise<PredictionResponse> {
    const formData = new FormData();

    // Add image if provided
    if (imageUri) {
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'soil_image.jpg',
      } as any);
    }

    // Add other parameters as query params
    const params = new URLSearchParams();
    if (data.N !== undefined) params.append('N', data.N.toString());
    if (data.P !== undefined) params.append('P', data.P.toString());
    if (data.K !== undefined) params.append('K', data.K.toString());
    if (data.ph !== undefined) params.append('ph', data.ph.toString());
    params.append('latitude', data.latitude.toString());
    params.append('longitude', data.longitude.toString());
    if (data.soil_type) params.append('soil_type', data.soil_type);

    const response = await api.post(
      `/predict-crop?${params.toString()}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  async predictSoil(imageUri: string): Promise<SoilPredictionResponse> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'soil_image.jpg',
    } as any);

    const response = await api.post('/predict-soil', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async getWaterScarcityAnalysis(
    data: WaterScarcityRequest
  ): Promise<WaterScarcityResponse> {
    const response = await api.post('/water-scarcity', data);
    return response.data;
  }

  async getAvailableCrops(): Promise<{ crops: CropInfo[] }> {
    const response = await api.get('/crops');
    return response.data;
  }

  async getHealthCheck(): Promise<HealthResponse> {
    const response = await api.get('/health');
    return response.data;
  }

  async getExamplePrediction(): Promise<PredictionResponse> {
    const response = await api.get('/example-prediction');
    return response.data;
  }
}

export default new ApiService();