require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes'); 
const passport = require('passport'); 
require('./config/passport'); 
const expenseRoutes = require('./routes/expense.routes');
const incomeRoutes = require('./routes/income.routes');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 4000;

// ตั้งค่า Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 100, // จำกัดแต่ละ IP ไว้ที่ 100 requests ต่อ window (15 นาที)
    standardHeaders: true, // บอก client ให้รู้ว่าโดน limit
    legacyHeaders: false, // ปิด header เก่าๆ
    message: 'Too many requests from this IP, please try again after 15 minutes', // ข้อความเมื่อโดนลิมิต
});

app.use(cors()); 
app.use(express.json());
app.use(passport.initialize())
app.use(helmet());
app.use(limiter);

// Routes
app.get('/', (req, res) => {
    res.send('Smart Tracker API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);


// ตั้งค่า CORS ให้เข้มงวด
const corsOptions = {
    origin: 'http://localhost:5173', // อนุญาตเฉพาะ Frontend ของเราเท่านั้น
    optionsSuccessStatus: 200 // สำหรับ browser เก่าๆ
};
app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});