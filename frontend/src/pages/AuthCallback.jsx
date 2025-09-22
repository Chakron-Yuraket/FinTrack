import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      console.log("Token ดักจับได้แล้ว:", token);
      localStorage.setItem('authToken', token);
      navigate('/dashboard');

    } else {
      console.error("ไม่เจอ Token! กลับไปหน้า Login");
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <p>กำลังตรวจสอบข้อมูล... กรุณารอสักครู่</p>
    </div>
  );
}

export default AuthCallback;