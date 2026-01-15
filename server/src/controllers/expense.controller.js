import * as expenseService from "../services/expense.service.js";

export const createExpense = async (req, res) => {
  try {
    const expense = await expenseService.addExpense({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getExpenses(req.query);
    res.status(200).json(expenses);
  } catch {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};
