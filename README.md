# ⚡ HYDRA Energy Intelligence Dashboard

A web-based dashboard built for The Awareness Company (TACo) case study.
The dashboard visualises site energy usage, detects anomalies, and generates insights by combining HYDRA API data with external weather information.

# 🌍 Overview

The HYDRA Energy Intelligence Dashboard provides sustainability insights for energy monitoring across sectors.
This application delivers:

Real-time Energy Monitoring: Track consumption patterns with interactive visualizations
Advanced Analytics: 7-day moving averages, anomaly detection, and forecasting
Weather Correlation: Integrate external weather data to explain usage patterns
AI-Powered Insights: Context-aware explanations for energy spikes and trends

Demo: https://oratileaudrey.github.io/HYDRA-Dashboard/

# ✨ Features

Core Functionality

✅ Authentication: Secure OAuth 2.0 login with HYDRA identity server
✅ Data Visualization: 6 interactive chart types (Bar, Area, Gauge, Heatmap, Moving Average, Forecast)
✅ 7-Day Moving Average: Smoothed trend analysis to identify patterns
✅ Anomaly Detection: Automatic flagging of days with >20% above-average consumption
✅ 3-Day Forecasting: Linear regression-based energy prediction
✅ Weather Integration: Temperature and condition overlays using Open-Meteo API
✅ Date Range Filtering: Flexible time period selection with quick presets
✅ Responsive Design: Mobile-first UI that works on all devices

Advanced Features

🧠 AI Insights: Contextual explanations combining anomalies and weather
📊 Summary Cards: Real-time metrics (total, average, anomalies, forecast)
🎨 Modern UI: Gradient backgrounds, hover effects, smooth transitions
⚡ Performance: Optimized data loading with computed properties
🔒 Security: Token-based authentication, protected routes

# 🛠️ Tech Stack
Frontend

Framework: Vue 3 
Language: TypeScript 5.9.3
Styling: Tailwind CSS 3.4.17
Charts: ApexCharts (vue3-apexcharts)
Routing: Vue Router 4
HTTP Client: Axios

Backend Integration

HYDRA API: Energy data aggregation endpoint
Weather API: Open-Meteo (free, no API key required)
Authentication: OAuth 2.0 password grant flow

Development Tools

Build Tool: Vite
Package Manager: npm
Code Quality: ESLint, Prettier
Version Control: Git

# 📁 Project Structure

## Project Structure
```
HYDRA-Dashboard/
├── .vscode/                  # VSCode configuration
├── dist/                     # Build output directory
├── node_modules/             # Dependencies
├── public/                   # Static assets
│   └── favicon.png
├── src/
│   ├── assets/
│   │   └── main.css         # Global styles
│   ├── components/
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── AreaChart.vue
│   │   │   ├── BarChart.vue
│   │   │   ├── Dashboard.vue
│   │   │   ├── DateRangePicker.vue
│   │   │   ├── ForecastChart.vue
│   │   │   ├── GaugeChart.vue
│   │   │   └── MovingAverageChart.vue
│   │   └── plugins/         # Plugin components
│   ├── routers/
│   │   └── index.ts         # Vue Router configuration
│   ├── services/
│   │   ├── auth.ts          # Authentication service
│   │   ├── energyService.ts # Energy data API service
│   │   └── weatherService.ts # Weather data API service
│   ├── types/               # TypeScript type definitions
│   ├── views/               # Page-level components
│   ├── App.vue              # Root component
│   ├── main.ts              # Application entry point
│   └── hydra.ts             # Core hydra utilities
├── .gitignore
├── index.html               # HTML entry point
├── package.json             # Project dependencies and scripts
├── package-lock.json        # Locked dependency versions
├── postcss.config.js        # PostCSS configuration
├── README.md                # Project documentation
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── jsconfig.json            # JavaScript configuration
└── vite.config.js           # Vite build configuration
```

# ⚙️ Setup & Run

1️⃣ Clone the Repository
git clone https://github.com/OratileAudrey/HYDRA-Dashboard
cd hydra

2️⃣ Install Dependencies
npm install

3️⃣ Run the Development Server
npm run dev


Visit the app at http://localhost:5173

# 📖 Usage
Login

Navigate to the application URL
Enter your HYDRA credentials
Click "Login" to authenticate
You'll be redirected to the dashboard upon successful authentication

Dashboard Navigation
Summary Cards

View total energy consumption, daily average, anomalies, and forecast at a glance

Date Range Selection

Click the calendar icon in the top-right
Choose from quick presets (7, 30, 90 days) or select custom dates
Click "Apply" to update all charts

Charts & Analytics

Bar Chart: Daily consumption with color-coded ranges
Area Chart: Cumulative energy trends
Moving Average: 7-day smoothed trends with temperature overlay
Forecast Chart: 3-day predictions with confidence intervals
Gauge Chart: Progress toward monthly target
Heatmap: Weekly consumption patterns

AI Insights

Review the highlighted insight box for contextual explanations
Insights automatically correlate anomalies with weather data

Logout
Click the "Logout" button in the top-right to end your session.


# 🔌 API Integration
HYDRA Energy API
Authentication Endpoint
POST https://identity.hydra.africa/connect/token
Content-Type: application/x-www-form-urlencoded

Body:
  client_id: ro.client
  grant_type: password
  client_secret: secret
  scope: api1
  username: [your-username]
  password: [your-password]
Energy Data Endpoint
POST https://hydra-api.azurewebsites.net/Sensor/exportAggregatedNumbers?binBy=day
Authorization: Bearer [access_token]
Content-Type: application/json

Body:
{
  "useCsv": false,
  "deviceId": "38394d4c-cb8e-ef11-a81c-6045bd88aa3b",
  "from": "2025-03-01",
  "to": "2025-03-31",
  "sensors": ["470b1334-0000-0001-0000-000000000000"]
}
Energy Calculation
typescriptkWh = (max - min) / 1000  // Convert Wh to kWh
Weather API (Open-Meteo)
Forecast Endpoint
GET https://api.open-meteo.com/v1/forecast

Parameters:
  latitude: -25.7479 (Pretoria)
  longitude: 28.2293
  start_date: 2025-03-01
  end_date: 2025-03-31
  daily: temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode
  timezone: Africa/Johannesburg


# 👩‍💻 Author

Audrey Manaleng
Web Developer 
📧 manaleng.audrey2000@gmail.com

# 🙏 Acknowledgments

HYDRA for providing the energy monitoring API
Open-Meteo for free weather data access
The Awareness Company for the opportunity
Vue.js and ApexCharts communities for excellent documentation