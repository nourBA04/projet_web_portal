import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

// Enregistrer les composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API_URL = "/api"; // URL relative (via le proxy Vite)

const Analytics = () => {
  const [stats, setStats] = useState({
    totalRevenue: "$0",
    avgOrderValue: "$0",
    customerRetention: "0%",
  });
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [
      {
        label: "Revenue",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  });
  const [customerGrowthData, setCustomerGrowthData] = useState({
    labels: [],
    datasets: [
      {
        label: "Customer Growth",
        data: [],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  });

  // Charger les données au montage du composant
  useEffect(() => {
    fetchStats();
    fetchRevenueData();
    fetchCustomerGrowthData();
  }, []);

  // Récupérer les statistiques globales
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/analytics/stats`);
      const data = await response.json();
      if (data.success) {
        setStats({
          totalRevenue: `$${data.data.totalRevenue.toFixed(2)}`,
          avgOrderValue: `$${data.data.avgOrderValue.toFixed(2)}`,
          customerRetention: `${data.data.customerRetention.toFixed(2)}%`,
        });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques:", err);
    }
  };

  // Récupérer les données de revenus
  const fetchRevenueData = async () => {
    try {
      const response = await fetch(`${API_URL}/analytics/revenue`);
      const data = await response.json();
      if (data.success) {
        setRevenueData({
          labels: data.data.map((item) => item.month),
          datasets: [
            {
              label: "Revenue",
              data: data.data.map((item) => item.revenue),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des revenus:", err);
    }
  };

  // Récupérer les données de croissance des clients
  const fetchCustomerGrowthData = async () => {
    try {
      const response = await fetch(`${API_URL}/analytics/customer-growth`);
      const data = await response.json();
      if (data.success) {
        setCustomerGrowthData({
          labels: data.data.map((item) => item.month),
          datasets: [
            {
              label: "Customer Growth",
              data: data.data.map((item) => item.new_customers),
              borderColor: "rgba(153, 102, 255, 1)",
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              fill: true,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de la croissance des clients:", err);
    }
  };

  // Options pour les graphiques
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Revenue Over Time",
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-500">Analytics Dashboard</h1>

      {/* Section des statistiques */}
      <div className="grid gap-6 md:grid-cols-3 mb-6 ">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-semibold text-gray-900">{stats.totalRevenue}</div>
              <div className="text-sm text-green-600">+12.3%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-semibold text-gray-900">{stats.avgOrderValue}</div>
              <div className="text-sm text-green-600">+8.2%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Customer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-semibold text-gray-900">{stats.customerRetention}</div>
              <div className="text-sm text-green-600">+3.1%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section des graphiques */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={revenueData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={customerGrowthData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;