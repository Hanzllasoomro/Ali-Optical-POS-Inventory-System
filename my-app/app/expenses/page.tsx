"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

type Expense = {
  _id: string;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
};

type NewExpenseForm = {
  title: string;
  amount: number;
  category: string;
  expenseDate?: string;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<NewExpenseForm>({
    title: "",
    amount: 0,
    category: "OTHER",
    expenseDate: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAdd = async () => {
    setError(null);
    setLoading(true);
    try {
      await api.post("/expenses", newExpense);
      setNewExpense({ title: "", amount: 0, category: "OTHER", expenseDate: undefined });
      fetchExpenses();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    await api.delete(`/expenses/${_id}`);
    fetchExpenses();
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[--color-muted]">Expense log</p>
        <h2 className="text-2xl font-semibold text-[--foreground]">Expenses</h2>
        <p className="text-sm text-[--color-muted]">Add a title, amount, category, and optional date.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <label className="space-y-1">
          <span className="text-sm font-medium">Title</span>
          <input
            type="text"
            placeholder="Electricity bill"
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
            value={newExpense.title}
            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Amount</span>
          <input
            type="number"
            placeholder="1200"
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: +e.target.value })}
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Category</span>
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
          >
            <option value="RENT">Rent</option>
            <option value="SALARY">Salary</option>
            <option value="PURCHASE">Purchase</option>
            <option value="ELECTRICITY">Electricity</option>
            <option value="INTERNET">Internet</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Expense date (optional)</span>
          <input
            type="date"
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2"
            onChange={(e) => setNewExpense({ ...newExpense, expenseDate: e.target.value })}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 items-center rounded-xl border border-[--color-border] bg-white px-3 py-2 shadow-sm">
        <button
          className="rounded-lg border border-[--color-primary] bg-[--color-primary] px-4 py-3 text-black font-semibold shadow hover:-translate-y-[1px] hover:bg-[--color-primary-strong] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--color-primary] disabled:opacity-60"
          onClick={handleAdd}
          disabled={loading}
          type="button"
        >
          {loading ? "Adding..." : "Add expense"}
        </button>
        <button
          className="rounded-lg border border-[--color-border] bg-white px-4 py-3 font-semibold text-[--color-muted] hover:text-[--foreground]"
          onClick={() => setNewExpense({ title: "", amount: 0, category: "OTHER", expenseDate: undefined })}
          type="button"
        >
          Clear
        </button>
      </div>

      <div className="bg-white shadow rounded-2xl border border-[--color-border] p-4 space-y-3">
        {expenses.map((exp) => (
          <div key={exp._id} className="flex justify-between items-start border-b border-[--color-border] pb-3 last:border-none last:pb-0">
            <div>
              <h3 className="font-semibold text-[--foreground]">{exp.title}</h3>
              <p className="text-sm text-[--color-muted]">PKR {exp.amount}</p>
              <p className="text-xs text-[--color-muted]">{exp.category}</p>
              {exp.expenseDate && (
                <p className="text-xs text-[--color-muted]">Date: {exp.expenseDate?.slice(0, 10)}</p>
              )}
            </div>
            <button onClick={() => handleDelete(exp._id)} className="text-red-500 text-sm font-semibold">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
