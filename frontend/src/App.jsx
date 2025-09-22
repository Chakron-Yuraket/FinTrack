import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import Components และ Pages ทั้งหมด
import LoginPage from './pages/Login';
import AuthCallback from "./pages/AuthCallback";
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedPage from './components/AnimatedPage';
import EditTransaction from './pages/EditTransaction';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Component นี้จะถูก render ภายใน Router ทำให้ useLocation ทำงานได้
function AnimatedRoutes() {
    const location = useLocation(); // ตอนนี้ Hook นี้จะทำงานได้อย่างถูกต้อง

    return (
        // AnimatePresence จะคอยจัดการ animation ของ component ที่กำลังจะหายไป
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* --- Public Routes (หน้าที่ไม่ต้อง Login) --- */}
                <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/" element={<LoginPage />} />

                {/* --- Private Routes (หน้าที่ต้อง Login) --- */}
                {/* เราใช้ Route เดียวเพื่อห่อทุกหน้าที่ต้องการการป้องกัน */}
                <Route element={<ProtectedRoute />}>
                    {/* ทุกๆ Route ที่อยู่ข้างในนี้ จะถูกป้องกันโดย "ยาม" */}
                    <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
                    <Route path="/transactions" element={<AnimatedPage><Transactions /></AnimatedPage>} />
                    <Route path="/transactions/new" element={<AnimatedPage><AddTransaction /></AnimatedPage>} />
                    <Route path="/transactions/:type/:id/edit" element={<AnimatedPage><EditTransaction /></AnimatedPage>} />
                    <Route path="/reports" element={<AnimatedPage><Reports /></AnimatedPage>} />
                    <Route path="/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />  
                </Route>
            </Routes>
        </AnimatePresence>
    );
}


function App() {
  return (
    // <Router> จะเป็น Component ตัวบนสุด
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;