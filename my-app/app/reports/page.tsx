"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ReportData = {
  labels: string[];
  sales: number[];
  expenses: number[];
  profit: number[];
};

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    labels: [],
    sales: [],
    expenses: [],
    profit: [],
  });
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("day");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get(`/reports/dashboard?period=${period}`);
      setReportData(res.data ?? { labels: [], sales: [], expenses: [], profit: [] });
    } catch (err: any) {
      setReportData({ labels: [], sales: [], expenses: [], profit: [] });
      setError(err?.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [period]);

  const salesChartData = {
    labels: reportData.labels,
    datasets: [
      {
        label: "Sales",
        data: reportData.sales,
        borderColor: "rgb(34,197,94)",
        backgroundColor: "rgba(34,197,94,0.3)",
      },
      {
        label: "Expenses",
        data: reportData.expenses,
        borderColor: "rgb(239,68,68)",
        backgroundColor: "rgba(239,68,68,0.3)",
      },
    ],
  };

  const profitChartData = {
    labels: reportData.labels,
    datasets: [
      {
        label: "Profit",
        data: reportData.profit,
        borderColor: "rgb(59,130,246)",
        backgroundColor: "rgba(59,130,246,0.3)",
      },
    ],
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Live Reports Dashboard</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setPeriod("day")}
          className={`px-3 py-1 rounded ${period === "day" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Daily
        </button>
        <button
          onClick={() => setPeriod("week")}
          className={`px-3 py-1 rounded ${period === "week" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Weekly
        </button>
        <button
          onClick={() => setPeriod("month")}
          className={`px-3 py-1 rounded ${period === "month" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setPeriod("year")}
          className={`px-3 py-1 rounded ${period === "year" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Yearly
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-2">Sales vs Expenses</h3>
        <Bar key={period + "-sales"} data={salesChartData} options={{ plugins: { legend: { display: true } } }} />
        {loading && <p className="mt-2 text-sm text-gray-500">Loading…</p>}
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-2">Profit</h3>
        <Line key={period + "-profit"} data={profitChartData} options={{ plugins: { legend: { display: true } } }} />
        {loading && <p className="mt-2 text-sm text-gray-500">Loading…</p>}
      </div>
    </div>
  );
}
