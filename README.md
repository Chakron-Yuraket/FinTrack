FinTrack - Smart Expense & Income Tracker

FinTrack เป็นเว็บแอปพลิเคชัน Open Source สำหรับจัดการรายรับรายจ่าย ที่ออกแบบมาโดยเฉพาะเพื่อฟรีแลนซ์และ SME ขนาดเล็ก ช่วยให้การติดตามสถานะทางการเงินเป็นเรื่องง่าย, เห็นภาพชัดเจน, และทำได้ทุกที่ทุกเวลา

Smart Expense & Income Tracker is an open-source web application designed for freelancers and small businesses to manage their income and expenses effortlessly. It allows users to log financial data, attach receipts, generate reports, view a real-time financial dashboard, and receive budget alerts.


✨ Features (คุณสมบัติหลัก)

📊 Real-time Dashboard: แดชบอร์ดสรุปภาพรวมรายรับ, รายจ่าย, และยอดคงเหลือ พร้อมกราฟแสดงแนวโน้ม

💸 Transaction Management: เพิ่ม, แก้ไข, และลบรายการรายรับ-รายจ่ายได้อย่างง่ายดาย

🔐 Secure Authentication: รองรับการลงชื่อเข้าใช้ด้วย Google Account ที่ปลอดภัย

📄 Receipt Attachment: (Coming Soon) แนบไฟล์รูปภาพใบเสร็จไปกับแต่ละรายการได้

📈 Reports: (Coming Soon) สร้างและ Export รายงานสรุปการเงินในรูปแบบ PDF หรือ Excel

🔔 Budget Alerts: (Coming Soon) ตั้งงบประมาณรายเดือนและรับการแจ้งเตือนเมื่อใกล้ถึงกำหนด

🛠️ Tech Stack (เทคโนโลยีที่ใช้)

Frontend:

React (with Vite)

Tailwind CSS for styling

Recharts for data visualization

Framer Motion for animations

Axios for API communication

SweetAlert2 for beautiful alerts

Backend:

Node.js with Express

PostgreSQL for the database

Prisma as the ORM

JWT (JSON Web Tokens) for authentication

Passport.js for Google OAuth 2.0

Infrastructure & Deployment:

Docker for containerization

Render for hosting (Database, Backend, Frontend)

GitHub Actions for CI/CD (optional)

🚀 Getting Started (เริ่มต้นใช้งาน)

หากต้องการรันโปรเจกต์นี้บนเครื่องของคุณ (Local Development) ทำตามขั้นตอนต่อไปนี้:

Prerequisites (สิ่งที่ต้องมี)

Node.js (v18 or later)

Docker and Docker Compose

A code editor like VS Code

Installation (การติดตั้ง)

Clone the repository:

code
Bash
download
content_copy
expand_less

git clone https://github.com/[your-username]/fintrack.git
cd fintrack

Setup Backend:

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
cd backend

# Create a .env file from the example
cp .env.example .env 

# Install dependencies
npm install

Setup Frontend:

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
cd ../frontend

# Install dependencies
npm install

Start the Database:

ในโฟลเดอร์ backend, รัน Docker Compose เพื่อสร้าง PostgreSQL database:

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
docker-compose up -d

Run Prisma Migration:

ในโฟลเดอร์ backend, สั่งให้ Prisma สร้างตารางใน Database:

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
npx prisma migrate dev

Setup Google OAuth Credentials:

ไปที่ Google Cloud Console และสร้าง OAuth 2.0 Client ID

เพิ่ม http://localhost:4000/api/auth/google/callback ใน Authorized redirect URIs

นำ Client ID และ Client Secret มาใส่ในไฟล์ .env ของ backend

Run the Application:

Terminal 1 (Backend):

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
cd backend
npm run dev

Terminal 2 (Frontend):

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
cd frontend
npm run dev

แอปพลิเคชันของคุณควรจะพร้อมใช้งานที่ http://localhost:5173

🤝 Contributing (การมีส่วนร่วม)

เรายินดีต้อนรับทุกการมีส่วนร่วม! ไม่ว่าจะเป็นการแจ้งบั๊ก, เสนอฟีเจอร์ใหม่, หรือส่ง Pull Request

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License (สัญญาอนุญาต)

This project is licensed under the MIT License - see the LICENSE.md file for details.

เคล็ดลับเพิ่มเติม:

สร้างไฟล์ .env.example: ในโฟลเดอร์ backend สร้างไฟล์นี้ขึ้นมา แล้วก๊อป "Key" ทั้งหมดจาก .env ไปใส่ แต่ ไม่ต้องใส่ Value เช่น:

code
Env
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/smart_tracker"
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CORS_ORIGIN="http://localhost:5173"

