import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function EditTransaction() {
  const navigate = useNavigate();
  const { type, id } = useParams(); // ดึง parameters จาก URL, เช่น "expenses", "uuid-goes-here"
  
  // State สำหรับเก็บข้อมูลในฟอร์ม
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    date: '',
    // เราไม่ได้ใช้ `type` ในฟอร์ม แต่เก็บไว้เพื่อความสมบูรณ์
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // State สำหรับแสดงสถานะ Loading

  // useEffect: ทำงานเมื่อ component โหลด หรือเมื่อ id/type ใน URL เปลี่ยนไป
  useEffect(() => {
    const fetchTransaction = async () => {
      setIsLoading(true);
      try {
        const endpoint = `/${type.toLowerCase()}s/${id}`; // สร้าง URL สำหรับ API, เช่น "/expenses/some-id"
        const response = await apiClient.get(endpoint);
        const txData = response.data;
        
        // Format date ให้อยู่ในรูปแบบ YYYY-MM-DD เพื่อให้ input type="date" แสดงผลได้ถูกต้อง
        if (txData.date) {
            txData.date = new Date(txData.date).toISOString().split('T')[0];
        }

        setFormData(txData); // นำข้อมูลที่ได้มาใส่ใน State ของฟอร์ม
      } catch (error) {
        console.error("Failed to fetch transaction", error);
        setError("Could not load transaction data.");
        MySwal.fire('Error!', 'Could not load transaction data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [id, type]);

  // จัดการการเปลี่ยนแปลงในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // จัดการการ submit ฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = `/${type === 'income' ? 'incomes' : 'expenses'}/${id}`;
      await apiClient.put(endpoint, {
        ...formData,
        amount: parseFloat(formData.amount)
      });

      MySwal.fire({
          title: 'Updated!',
          text: 'Your transaction has been updated successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
      }).then(() => {
        navigate('/transactions'); // กลับไปที่หน้ารายการทั้งหมด
      });

    } catch (error) {
      console.error("Failed to update transaction", error);
      MySwal.fire('Error!', 'Could not update the transaction.', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading transaction...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Edit Transaction</h1>
      <p className="text-gray-500 mb-6">Update your income or expense record.</p>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Transaction Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
             {/* Date */}
             <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div>
            {/* Category */}
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Food</option>
              <option>Transport</option>
              <option>Salary</option>
              <option>Freelance</option>
              <option>Shopping</option>
              <option>Utilities</option>
              <option>Other</option>
            </select>
          </div>
          
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg shadow hover:bg-blue-700 font-semibold">
              Update Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTransaction;