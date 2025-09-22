const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // 1. หา Token จาก Header ที่ชื่อ 'authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // รูปแบบคือ "Bearer TOKEN"

  // 2. ถ้าไม่มี Token เลย ก็ไล่กลับไป
  if (token == null) return res.sendStatus(401); // Unauthorized

  // 3. ตรวจสอบว่า Token ถูกต้องและยังไม่หมดอายุหรือไม่
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden (Token ไม่ถูกต้อง)

    // 4. ถ้าถูกต้อง ให้เก็บข้อมูล user ไว้ใน request แล้วปล่อยให้ไปต่อ
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;