import Order from "../models/Order.model.js";
import Expense from "../models/Expense.model.js";

const pad = (num) => String(num).padStart(2, "0");

const buildPeriodConfig = (period) => {
  const now = new Date();

  switch (period) {
    case "day": {
      const startDate = new Date(now);
      startDate.setUTCMinutes(0, 0, 0);
      startDate.setUTCHours(now.getUTCHours() - 23);

      const labels = Array.from({ length: 24 }, (_, idx) => {
        const slot = new Date(startDate);
        slot.setUTCHours(startDate.getUTCHours() + idx);
        return `${slot.getUTCFullYear()}-${pad(slot.getUTCMonth() + 1)}-${pad(slot.getUTCDate())} ${pad(slot.getUTCHours())}:00`;
      });

      return { startDate, labels, format: "%Y-%m-%d %H:00" };
    }

    case "week": {
      const startDate = new Date(now);
      startDate.setUTCHours(0, 0, 0, 0);
      startDate.setUTCDate(now.getUTCDate() - 6);

      const labels = Array.from({ length: 7 }, (_, idx) => {
        const slot = new Date(startDate);
        slot.setUTCDate(startDate.getUTCDate() + idx);
        return `${slot.getUTCFullYear()}-${pad(slot.getUTCMonth() + 1)}-${pad(slot.getUTCDate())}`;
      });

      return { startDate, labels, format: "%Y-%m-%d" };
    }

    case "month": {
      const startDate = new Date(now);
      startDate.setUTCHours(0, 0, 0, 0);
      startDate.setUTCDate(now.getUTCDate() - 29);

      const labels = Array.from({ length: 30 }, (_, idx) => {
        const slot = new Date(startDate);
        slot.setUTCDate(startDate.getUTCDate() + idx);
        return `${slot.getUTCFullYear()}-${pad(slot.getUTCMonth() + 1)}-${pad(slot.getUTCDate())}`;
      });

      return { startDate, labels, format: "%Y-%m-%d" };
    }

    case "year": {
      const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1, 0, 0, 0, 0));

      const labels = Array.from({ length: 12 }, (_, idx) => {
        const slot = new Date(startDate);
        slot.setUTCMonth(startDate.getUTCMonth() + idx);
        return `${slot.getUTCFullYear()}-${pad(slot.getUTCMonth() + 1)}`;
      });

      return { startDate, labels, format: "%Y-%m" };
    }

    default:
      return null;
  }
};

export const salesReport = async (from, to) => {
  return Order.aggregate([
    {
      $match: {
        orderDate: {
          ...(from && { $gte: new Date(from) }),
          ...(to && { $lte: new Date(to) }),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$total" },
        totalPaid: { $sum: "$paidAmount" },
        totalBalance: { $sum: "$balanceAmount" },
        ordersCount: { $sum: 1 },
      },
    },
  ]);
};

export const expenseReport = async (from, to) => {
  return Expense.aggregate([
    {
      $match: {
        expenseDate: {
          ...(from && { $gte: new Date(from) }),
          ...(to && { $lte: new Date(to) }),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$amount" },
      },
    },
  ]);
};

export const profitReport = async (from, to) => {
  const [sales] = await salesReport(from, to);
  const [expenses] = await expenseReport(from, to);

  return {
    totalSales: sales?.totalSales || 0,
    totalExpense: expenses?.totalExpense || 0,
    profit:
      (sales?.totalSales || 0) -
      (expenses?.totalExpense || 0),
  };
};

export const dashboardReport = async (period = "day") => {
  const config = buildPeriodConfig(period);

  if (!config) {
    throw new Error("Invalid period. Use day, week, month, or year.");
  }

  const salesAgg = await Order.aggregate([
    {
      $match: {
        orderDate: {
          $gte: config.startDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: config.format,
            date: "$orderDate",
            timezone: "UTC",
          },
        },
        total: { $sum: { $ifNull: ["$total", 0] } },
      },
    },
  ]);

  const expenseAgg = await Expense.aggregate([
    {
      $match: {
        expenseDate: {
          $gte: config.startDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: config.format,
            date: "$expenseDate",
            timezone: "UTC",
          },
        },
        total: { $sum: { $ifNull: ["$amount", 0] } },
      },
    },
  ]);

  const salesMap = Object.fromEntries(
    salesAgg.map((entry) => [entry._id, entry.total])
  );

  const expenseMap = Object.fromEntries(
    expenseAgg.map((entry) => [entry._id, entry.total])
  );

  const sales = config.labels.map((label) => salesMap[label] || 0);
  const expenses = config.labels.map((label) => expenseMap[label] || 0);
  const profit = sales.map((value, idx) => value - expenses[idx]);

  return {
    labels: config.labels,
    sales,
    expenses,
    profit,
  };
};
