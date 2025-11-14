import axios from 'axios'

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'
const LATITUDE = -25.7479
const LONGITUDE = 28.2293

export interface WeatherData {
  date: string;
  temp: number;
  condition: string;
  humidity?: number;
  precipitation?: number;
}

// To define the API response structure
interface OpenMeteoResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weathercode: number[];
  };
}

export async function getWeatherData(
  fromDate: string,
  toDate: string
): Promise<WeatherData[]> {
  try {
    const response = await axios.get<OpenMeteoResponse>(WEATHER_API_URL, {
      params: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        start_date: fromDate,
        end_date: toDate,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
        timezone: 'Africa/Johannesburg'
      }
    })

    const { daily } = response.data

    if (!daily || !daily.time) {
      throw new Error('Invalid weather data response')
    }

    const weatherData: WeatherData[] = daily.time.map((date: string, idx: number) => {
      const avgTemp = (daily.temperature_2m_max[idx] + daily.temperature_2m_min[idx]) / 2
      const weatherCode = daily.weathercode[idx]
      
      return {
        date,
        temp: Math.round(avgTemp * 10) / 10,
        condition: getWeatherCondition(weatherCode),
        precipitation: daily.precipitation_sum[idx]
      }
    })

    return weatherData
  } catch (error: any) {
    console.error('Failed to fetch weather data:', error)
    
    // Returning mock data as fallback
    return generateMockWeatherData(fromDate, toDate)
  }
}

// Converting weather codes to readable conditions
function getWeatherCondition(code: number): string {
  if (code === 0) return 'clear skies'
  if (code <= 3) return 'partly cloudy'
  if (code <= 48) return 'foggy'
  if (code <= 67) return 'rainy'
  if (code <= 77) return 'snowy'
  if (code <= 82) return 'rain showers'
  if (code <= 86) return 'snow showers'
  if (code <= 99) return 'thunderstorms'
  return 'varied conditions'
}

// Fallback mock data generator
function generateMockWeatherData(fromDate: string, toDate: string): WeatherData[] {
  const start = new Date(fromDate)
  const end = new Date(toDate)
  const data: WeatherData[] = []
  
  const current = new Date(start)
  while (current <= end) {
    const dayOfYear = Math.floor((current.getTime() - new Date(current.getFullYear(), 0, 0).getTime()) / 86400000)
    
    // Simulating seasonal temperature variation
    const baseTemp = 20 + 10 * Math.sin((dayOfYear / 365) * Math.PI * 2)
    const randomVariation = (Math.random() - 0.5) * 10
    const temp = Math.round((baseTemp + randomVariation) * 10) / 10
    
    const conditions = ['clear skies', 'partly cloudy', 'cloudy', 'rainy', 'sunny']
    const condition = conditions[Math.floor(Math.random() * conditions.length)]
    
    data.push({
      date: current.toISOString().split('T')[0],
      temp,
      condition,
      precipitation: Math.random() * 5
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return data
}