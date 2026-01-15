import * as reportService from "../services/report.service.js";

export const getSalesReport = async (req, res) => {
  const { from, to } = req.query;
  const [data] = await reportService.salesReport(from, to);
  res.json(data || {});
};

export const getExpenseReport = async (req, res) => {
  const { from, to } = req.query;
  const [data] = await reportService.expenseReport(from, to);
  res.json(data || {});
};

export const getProfitReport = async (req, res) => {
  const { from, to } = req.query;
  const data = await reportService.profitReport(from, to);
  res.json(data);
};

export const getDashboardReport = async (req, res) => {
  const period = req.query.period || "day";
  const data = await reportService.dashboardReport(period);
  res.json(data);
};
