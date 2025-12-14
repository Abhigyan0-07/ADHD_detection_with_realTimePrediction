"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RealTimeData {
  timestamp: string;
  dataType: string;
  value: number;
  metadata?: any;
}

interface Prediction {
  id: string;
  type: string;
  predictedValue: number;
  confidence: number;
  explanation: string;
  timeHorizon: number;
  createdAt: string;
}

interface DataSummary {
  [key: string]: {
    average: number;
    min: number;
    max: number;
    count: number;
    trend: "up" | "down" | "stable";
  };
}

export default function RealTimeDashboard() {
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [dataSummary, setDataSummary] = useState<DataSummary>({});
  const [isCollecting, setIsCollecting] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState({
    attention: 0.5,
    engagement: 0.5,
    performance: 0.5,
    mood: 0.5,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const predictionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchInitialData();
    startDataCollection();
    startPredictionUpdates();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (predictionIntervalRef.current)
        clearInterval(predictionIntervalRef.current);
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [dataRes, summaryRes, predictionsRes] = await Promise.all([
        fetch("/api/realtime/data?minutes=60"),
        fetch("/api/realtime/summary?hours=1"),
        fetch("/api/realtime/predict?limit=5"),
      ]);

      if (dataRes.ok) {
        const data = await dataRes.json();
        setRealTimeData(data.data || []);
      }

      if (summaryRes.ok) {
        const summary = await summaryRes.json();
        setDataSummary(summary.summary || {});
      }

      if (predictionsRes.ok) {
        const preds = await predictionsRes.json();
        setPredictions(preds.predictions || []);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const startDataCollection = () => {
    setIsCollecting(true);
    intervalRef.current = setInterval(async () => {
      try {
        // Simulate real-time data collection
        const newData = {
          dataType: ["attention", "engagement", "performance", "mood"][
            Math.floor(Math.random() * 4)
          ],
          value: Math.random(),
          metadata: { source: "simulated", confidence: 0.8 },
        };

        await fetch("/api/realtime/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        });

        // Update current metrics
        setCurrentMetrics((prev) => ({
          ...prev,
          [newData.dataType]: newData.value,
        }));

        // Refresh data
        fetchInitialData();
      } catch (error) {
        console.error("Error collecting data:", error);
      }
    }, 3000); // Collect data every 3 seconds
  };

  const startPredictionUpdates = () => {
    predictionIntervalRef.current = setInterval(async () => {
      try {
        const predictionTypes = [
          "attention_trend",
          "performance_forecast",
          "engagement_level",
        ];
        const randomType =
          predictionTypes[Math.floor(Math.random() * predictionTypes.length)];

        const response = await fetch("/api/realtime/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ predictionType: randomType, timeHorizon: 15 }),
        });

        if (response.ok) {
          const result = await response.json();
          setPredictions((prev) => [result.prediction, ...prev.slice(0, 4)]);
        }
      } catch (error) {
        console.error("Error making prediction:", error);
      }
    }, 30000); // Make predictions every 30 seconds
  };

  const getMetricColor = (value: number) => {
    if (value >= 0.7) return "text-green-600";
    if (value >= 0.4) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      default:
        return "➡️";
    }
  };

  const chartData = {
    labels: realTimeData
      .slice(-20)
      .map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Attention",
        data: realTimeData
          .filter((d) => d.dataType === "attention")
          .slice(-20)
          .map((d) => d.value),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Engagement",
        data: realTimeData
          .filter((d) => d.dataType === "engagement")
          .slice(-20)
          .map((d) => d.value),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Performance",
        data: realTimeData
          .filter((d) => d.dataType === "performance")
          .slice(-20)
          .map((d) => d.value),
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Real-Time Metrics Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Real-Time Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isCollecting ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            {isCollecting ? "Collecting Data" : "Paused"}
          </span>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(currentMetrics).map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 capitalize">{key}</p>
                <p className={`text-2xl font-bold ${getMetricColor(value)}`}>
                  {Math.round(value * 100)}%
                </p>
              </div>
              <div className="text-2xl">
                {key === "attention" && "🎯"}
                {key === "engagement" && "🔥"}
                {key === "performance" && "⭐"}
                {key === "mood" && "😊"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Summary */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Data Summary (Last Hour)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(dataSummary).map(([type, data]) => (
            <div key={type} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium capitalize">{type}</h3>
                <span className="text-lg">{getTrendIcon(data.trend)}</span>
              </div>
              <div className="space-y-1 text-sm">
                <p>Avg: {Math.round(data.average * 100)}%</p>
                <p>
                  Range: {Math.round(data.min * 100)}% -{" "}
                  {Math.round(data.max * 100)}%
                </p>
                <p>Samples: {data.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Real-Time Metrics</h2>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Predictions */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">AI Predictions</h2>
        <div className="space-y-4">
          <AnimatePresence>
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium capitalize">
                    {prediction?.type
                      ? prediction.type.replace("_", " ")
                      : "Unknown Type"}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {Math.round(prediction.confidence * 100)}% confidence
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        prediction.confidence > 0.7
                          ? "bg-green-500"
                          : prediction.confidence > 0.4
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {prediction.explanation}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>
                    Predicted: {Math.round(prediction.predictedValue * 100)}%
                  </span>
                  <span className="text-gray-500">
                    {new Date(prediction.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
