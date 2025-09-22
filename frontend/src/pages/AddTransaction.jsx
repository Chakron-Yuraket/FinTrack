import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import Swal from 'sweetalert2'; // Import SweetAlert2
import withReactContent from 'sweetalert2-react-content'; // Import ตัวช่วยสำหรับ React

// สร้าง Instance ของ Swal สำหรับใช้กับ React โดยเฉพาะ
const MySwal = withReactContent(Swal);

function AddTransaction() {
  const navigate = useNavigate();
  // State สำหรับเก็บข้อมูลทั้งหมดในฟอร์ม
  const [formData, setFormData] = useState({
    name: '',
    type: 'Expense', // ค่าเริ่มต้นเป็น Expense
    amount: '',
    category: 'Food', // ค่าเริ่มต้น (อาจจะเปลี่ยนตาม type ได้ในอนาคต)
    date: '',
  });
  // State สำหรับเก็บข้อความ error ของฟอร์ม (ถ้ามี)
  const [error, setError] = useState('');
  // State สำหรับป้องกันการกดปุ่มซ้ำซ้อน
  const [isSubmitting, setIsSubmitting] = useState(false);


  // ฟังก์ชันที่จะทำงานเมื่อมีการเปลี่ยนแปลงค่าใน input หรือ select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };


  // ฟังก์ชันที่จะทำงานเมื่อกดปุ่ม Submit ของฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บโหลดใหม่
    
    if (isSubmitting) return; // ถ้ากำลังส่งข้อมูลอยู่ ให้หยุด ไม่ทำซ้ำ

    setError(''); // เคลียร์ error เก่าทิ้ง

    // ตรวจสอบข้อมูลเบื้องต้นว่ากรอกครบหรือไม่
    if (!formData.name || !formData.amount || !formData.date || !formData.category) {
      setError('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true); // เริ่มส่งข้อมูล...

    try {
      // กำหนด endpoint ที่จะส่งข้อมูลไป โดยดูจาก 'type' ที่ user เลือก
      const endpoint = formData.type === 'Expense' ? '/expenses' : '/incomes';
      
      // "โทร" ไปที่ Backend ด้วย apiClient
      await apiClient.post(endpoint, {
          ...formData,
          amount: parseFloat(formData.amount) // แปลง amount ให้เป็นตัวเลขก่อนส่ง
      });

      // ถ้าสำเร็จ... แสดง Pop-up สวยๆ!
      MySwal.fire({
          title: 'Success!',
          text: 'Your transaction has been added.',
          icon: 'success',
          timer: 2000, // ให้ Pop-up ปิดเองใน 2 วินาที
          showConfirmButton: false // ไม่ต้องมีปุ่ม OK
      }).then(() => {
          // หลังจาก Pop-up ปิดแล้ว ให้พาผู้ใช้กลับไปที่หน้า Dashboard
          navigate('/dashboard');
      });

    } catch (err) {
      // ถ้าเกิดข้อผิดพลาด...
      const errorMessage = err.response?.data?.message || 'Failed to add transaction. Please try again.';
      setError(errorMessage);
      // แสดง Pop-up แจ้งเตือนข้อผิดพลาด
      MySwal.fire('Error!', errorMessage, 'error');
      console.error(err);
    } finally {
        setIsSubmitting(false); // ไม่ว่าจะสำเร็จหรือล้มเหลว ก็ให้กลับมากดปุ่มได้อีกครั้ง
    }
  };


  // --- ส่วนของการแสดงผล (UI) ---
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Add Transaction</h1>
      <p className="text-gray-500 mb-6">Add a new income or expense to your records.</p>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Transaction Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Coffee, Salary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type (Income/Expense) */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
              <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Expense</option>
                <option>Income</option>
              </select>
            </div>
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
            <div>
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
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          {/* (Optional) Attach Receipt - ยังไม่ทำ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Attach Receipt (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <p className="text-sm text-gray-600">File upload will be implemented later.</p>
            </div>
          </div>

          {/* Submit Button & Error Message */}
          <div>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg shadow hover:bg-blue-700 font-semibold disabled:bg-gray-400">
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;