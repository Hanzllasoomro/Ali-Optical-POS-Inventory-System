import Expense from "../models/Expense.model.js";

export const createExpense = (data) => {
  return Expense.create(data);
};

export const listExpenses = ({ from, to }) => {
  const query = {};

  if (from || to) {
    query.expenseDate = {};
    if (from) query.expenseDate.$gte = from;
    if (to) query.expenseDate.$lte = to;
  }

  return Expense.find(query).sort({ expenseDate: -1 });
};
