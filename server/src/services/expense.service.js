import * as expenseRepo from "../repository/expense.repository.js";

export const addExpense = async (data) => {
  return expenseRepo.createExpense(data);
};

export const getExpenses = async (query) => {
  return expenseRepo.listExpenses(query);
};
