# 🌱 AgriTech Assistant

A smart farming mobile app powered by **AI** — built with **React Native (Expo)** and a **Flask backend**.  
It provides intelligent crop recommendations, soil classification, and water scarcity forecasts.

🔗 **Repository:** [CropRecomendation](https://github.com/anshukumar2932/CropRecomendation)

---

## 📱 Features

### 🌾 Crop Recommendation
- AI-powered crop predictions using soil nutrients (N, P, K, pH)
- Weather and location-based suggestions
- Confidence scores for top 5 recommended crops

### 🏞️ Soil Detection
- CNN-based soil classification from camera or gallery images
- Supports multiple soil types (Black, Cinder, Laterite, Peat, Yellow)

### 💧 Water Forecasting
- Predicts future water availability and risk level
- Recommends drought-resistant crops and water-saving strategies

### 🎨 Extra Features
- Dark & Light mode (auto system detection)
- Offline-ready architecture
- Clean Material Design 3 UI

---

## 🚀 Getting Started

### Prerequisites
- **Python:** 3.8–3.11  
- **Node.js:** 18+  
- **Expo Go:** for mobile testing  
- **Git**, **Android Studio**, **(optional)** Xcode  

---

### 1️⃣ Clone Repository
```bash
git clone https://github.com/anshukumar2932/CropRecomendation.git
cd CropRecomendation
```

---

### 2️⃣ Backend Setup (Flask)

```bash
cd backend
python -m venv venv
# Activate environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

pip install -r ../requirements.txt
python main.py
```

Backend runs on **[http://localhost:8000](http://localhost:8000)**

---

### 3️⃣ Frontend Setup (React Native + Expo)

```bash
cd frontend
npm install
npm install -g @expo/cli   # if not installed
npx expo start --tunnel
```

Open the **Expo Go** app → Scan the QR code → App launches 🎉

---

## 🏗️ Project Structure

```
CropRecomendation/
├── backend/
│   ├── main.py
│   └── model_artifacts/
│       ├── model.joblib
│       ├── best_soil_cnn.pth
│       ├── scaler.joblib
│       ├── feature_names.joblib
│       ├── feature_medians.joblib
│       └── label_encoder.joblib
├── frontend/
│   ├── src/
│   │   ├── screens/          # App screens
│   │   ├── components/       # UI components
│   │   ├── context/          # Theme context
│   │   └── services/         # API & utilities
│   ├── assets/               # App icons & images
│   ├── android/              # Android config
│   ├── ios/                  # iOS config
│   ├── App.tsx
│   └── package.json
├── training-file/
│   ├── crop-recomendation.ipynb
│   └── soil-classification.ipynb
├── requirements.txt
└── README.md
```

---

## ⚙️ Configuration

### Backend URL (frontend/src/services/api.ts)

```typescript
const BASE_URL = 'http://localhost:8000';
// Android emulator: http://10.0.2.2:8000
// Production: https://your-api-domain.com
```

### Environment Variables (`frontend/.env`)

```env
API_BASE_URL=http://localhost:8000
EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
```

---

## 🔧 Tech Stack

**Frontend:** React Native (Expo), TypeScript, React Navigation, Axios  
**Backend:** Flask, scikit-learn, PyTorch, Joblib  
**ML Models:** Crop recommendation (XGBoost), Soil classification (CNN)  
**Other Tools:** Pandas, Prophet, Statsmodels

---

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm test
```

### Backend Testing

```bash
cd backend
pytest
```

---

## 🛠️ Deployment

### Backend Deployment (Flask)

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Deployment (Expo)

```bash
cd frontend
npx eas build --platform all
```

Deploy via **EAS**, **App Store Connect**, or **Google Play Console**.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🐛 Troubleshooting

### Common Issues

**Backend Connection Failed:**
- Ensure backend is running on port 8000
- Check if firewall is blocking the connection
- For Android emulator, use `http://10.0.2.2:8000`

**Module Not Found Errors:**
- Delete `node_modules` and run `npm install` again
- Clear Expo cache: `npx expo start --clear`

**Python Package Issues:**
- Ensure you're using Python 3.8-3.11
- Reactivate virtual environment
- Reinstall requirements: `pip install -r requirements.txt`

---

## 📚 API Documentation

### Crop Recommendation Endpoint
```http
POST /predict/crop
Content-Type: application/json

{
  "N": 50,
  "P": 40,
  "K": 30,
  "temperature": 25.5,
  "humidity": 80,
  "ph": 6.5,
  "rainfall": 200
}
```

### Soil Classification Endpoint
```http
POST /predict/soil
Content-Type: multipart/form-data

{
  "image": file
}
```

### Water Forecast Endpoint
```http
POST /predict/water
Content-Type: application/json

{
  "region": "north",
  "historical_data": [...]
}
```

---

## 🩵 License & Credits

* All dependencies under **MIT / Apache 2.0 / BSD**
* Built with ❤️ by **Anshu Kumar**

---

## 📚 Resources

* [Expo Documentation](https://docs.expo.dev/)
* [React Native Documentation](https://reactnative.dev/)
* [Flask Documentation](https://flask.palletsprojects.com/)
* [PyTorch Documentation](https://pytorch.org/docs/)
* [scikit-learn Documentation](https://scikit-learn.org/stable/documentation.html)

---

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Crop recommendation system
- Soil classification from images
- Water scarcity forecasting
- Dark/Light theme support

---

## 📞 Support

If you have any questions or run into issues, please:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/anshukumar2932/CropRecomendation/issues)
3. Create a new issue with detailed description

**Happy Farming!** 🌾
