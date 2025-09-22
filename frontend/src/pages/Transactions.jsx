import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link } from 'react-router-dom';

const MySwal = withReactContent(Swal);

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    try {
      // ดึงข้อมูลทั้ง 2 ส่วนพร้อมกัน
      const [expensesRes, incomesRes] = await Promise.all([
        apiClient.get('/expenses'),
        apiClient.get('/incomes')
      ]);

      const all = [
        ...expensesRes.data.map(exp => ({ ...exp, type: 'Expense' })),
        ...incomesRes.data.map(inc => ({ ...inc, type: 'Income' }))
      ];
      all.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(all);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

 const handleDelete = (id, type) => {
    MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => { // ใช้ .then() เพื่อรอผลลัพธ์
        if (result.isConfirmed) {
            try {
                const endpoint = type === 'Expense' ? `/expenses/${id}` : `/incomes/${id}`;
                await apiClient.delete(endpoint);

                // แจ้งเตือนว่าลบสำเร็จ!
                MySwal.fire(
                    'Deleted!',
                    'Your transaction has been deleted.',
                    'success'
                );
                
                fetchAllTransactions(); // รีเฟรชข้อมูล
            } catch (error) {
                console.error("Failed to delete transaction", error);
                MySwal.fire(
                    'Error!',
                    'Could not delete the transaction.',
                    'error'
                );
            }
        }
    });
};
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Transactions</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full text-left">
          {/* ... thead เหมือนกับใน Dashboard ... */}
          <thead>
              <tr className="text-sm font-semibold text-gray-500 border-b-2">
                  <th className="p-3">Date</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Actions</th>
              </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{new Date(tx.date).toLocaleDateString('en-GB')}</td>
                <td className="p-3 font-medium">{tx.name}</td>
                <td className="p-3">{tx.category}</td>
                <td className={`p-3 font-bold text-right ${tx.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.type === 'Income' ? '+' : '-'}
                  {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(tx.amount)}
                </td>
                <td className="p-3 text-center">
                  <Link
                   to={`/transactions/${tx.type.toLowerCase()}/${tx.id}/edit`}
                    className="text-blue-500 hover:text-blue-700 font-semibold mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(tx.id, tx.type)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <p className="text-center py-8">No transactions found.</p>}
      </div>
    </div>
  );
}

export default Transactions;