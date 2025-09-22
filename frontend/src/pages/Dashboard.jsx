import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import StatCard from '../components/StatCard';
import TransactionChart from '../components/TransactionChart'; // Import Chart Component
import { motion } from 'framer-motion';

function Dashboard() {
  // State for storing data fetched from the API
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  // useEffect runs once when the component mounts
  useEffect(() => {
    Promise.all([fetchExpenses(), fetchIncomes()]);
  }, []);

  // Function to fetch all expenses from the backend
  const fetchExpenses = async () => {
    try {
      const response = await apiClient.get('/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Function to fetch all incomes from the backend
  const fetchIncomes = async () => {
    try {
      const response = await apiClient.get('/incomes');
      setIncomes(response.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };


  // --- Calculation Section ---
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // --- Data Preparation Section ---
  // Combine and sort data for the recent transactions table
  const allTransactions = [
    ...expenses.map(exp => ({ ...exp, type: 'Expense' })),
    ...incomes.map(inc => ({ ...inc, type: 'Income' }))
  ];
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentTransactions = allTransactions.slice(0, 5);

  // Function to process and aggregate data by month for the chart
  const processChartData = () => {
    const monthlyData = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    allTransactions.forEach(tx => {
      const monthIndex = new Date(tx.date).getMonth();
      const monthName = months[monthIndex];

      if (!monthlyData[monthName]) {
        monthlyData[monthName] = { name: monthName, income: 0, expense: 0 };
      }

      if (tx.type === 'Income') {
        monthlyData[monthName].income += tx.amount;
      } else {
        monthlyData[monthName].expense += tx.amount;
      }
    });

    // To ensure the chart has a consistent order, sort by month index
    return Object.values(monthlyData).sort((a, b) => {
        return months.indexOf(a.name) - months.indexOf(b.name);
    });
  };

  const chartData = processChartData();


  // --- Animation Variants for Framer Motion ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };


  // --- Render Section (UI) ---
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
          <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500">Overview of your financial activities</p>
          </div>
          <Link to="/transactions/new" className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 font-semibold">
            + Add Transaction
          </Link>
      </div>

      {/* Stat Cards Section */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div variants={itemVariants}><StatCard title="Total Income" amount={totalIncome} colorClass="text-green-500" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="Total Expenses" amount={totalExpenses} colorClass="text-red-500" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="Net Balance" amount={netBalance} colorClass={netBalance >= 0 ? "text-gray-800" : "text-red-500"} /></motion.div>
      </motion.div>

      {/* Chart Section */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Income vs. Expenses</h2>
          <TransactionChart data={chartData} />
      </motion.div>

      {/* Recent Transactions Section */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="text-sm font-semibold text-gray-500 border-b-2 border-gray-200">
                          <th className="p-3">Date</th>
                          <th className="p-3">Description</th>
                          <th className="p-3">Category</th>
                          <th className="p-3 text-right">Amount</th>
                      </tr>
                  </thead>
                  <tbody>
                      {recentTransactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="p-3 text-sm text-gray-600">{new Date(tx.date).toLocaleDateString('en-GB')}</td>
                              <td className="p-3 font-medium text-gray-800">{tx.name}</td>
                              <td className="p-3 text-gray-600">{tx.category}</td>
                              <td className={`p-3 font-bold text-right ${tx.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                                  {tx.type === 'Income' ? '+' : '-'}
                                  {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(tx.amount)}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              {recentTransactions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No recent transactions found.</p>
              )}
          </div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;