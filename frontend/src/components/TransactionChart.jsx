import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Component นี้จะรับ 'data' (ข้อมูลที่เราเพิ่งเตรียม) เข้ามา
function TransactionChart({ data }) {
  // ถ้าไม่มีข้อมูล ให้แสดงข้อความแทน
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-400">Not enough data to display chart.</p>
      </div>
    );
  }

  return (
    // ResponsiveContainer จะทำให้กราฟปรับขนาดตาม container ของมัน
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
        <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} name="Expense" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TransactionChart;