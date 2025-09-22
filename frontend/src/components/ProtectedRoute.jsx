// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';

function ProtectedRoute() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ถ้ามี token ให้แสดง Layout หลัก และให้ Outlet จัดการว่าจะ render หน้าไหนต่อ
  return <MainLayout><Outlet /></MainLayout>;
}

export default ProtectedRoute;