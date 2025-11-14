import axios from "axios";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { token, from, to } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const response = await axios.post(
      "https://hydra-api.azurewebsites.net/Sensor/exportAggregatedNumbers?binBy=day",
      {
        useCsv: false,
        deviceId: "38394d4c-cb8e-ef11-a81c-6045bd88aa3b",
        from: from || "2025-03-01",
        to: to || "2025-03-31",
        sensors: ["470b1334-0000-0001-0000-000000000000"]
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );

    res.status(200).json(response.data);
  } catch (e) {
    console.error("Hydra API Error:", e.response?.data || e.message);
    res.status(500).json({ 
      error: "Hydra request failed",
      details: e.response?.data || e.message 
    });
  }
}