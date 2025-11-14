import axios from 'axios'

// HYDRA Export per day endpoint
const HYDRA_API_URL = '/hydra-api/Sensor/exportAggregatedNumbers?binBy=day'

// Default device and sensor IDs from the case study
const DEVICE_ID = '38394d4c-cb8e-ef11-a81c-6045bd88aa3b'
const SENSOR_ID = '470b1334-0000-0001-0000-000000000000'

// Define the shape of a response item
interface EnergyRecord {
  sensorId: string
  year: number
  month: number
  day: number
  count: number
  sum: number
  min: number
  max: number
}

// Define the formatted version we'll use in the frontend
export interface EnergyData {
  date: string
  kWh: number
  raw: EnergyRecord
}

export async function getEnergyData(
  token: string,
  fromDate: string = '2025-03-01',
  toDate: string = '2025-03-31'
): Promise<EnergyData[]> {
  try {
    const response = await axios.post<EnergyRecord[]>(
      HYDRA_API_URL,
      {
        useCsv: false,
        deviceId: DEVICE_ID,
        from: fromDate,
        to: toDate,
        sensors: [SENSOR_ID],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const formatted: EnergyData[] = response.data.map((item) => ({
      date: `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`,
      kWh: (item.max - item.min) / 1000, // Convert to kWh (assuming values are in Wh)
      raw: item,
    }))

    return formatted
  } catch (error: any) {
    console.error('Failed to fetch energy data:', error)
    throw new Error(error.response?.data?.message || 'Error fetching energy data')
  }
}