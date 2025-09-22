# Stage 1: Build the application
# ใช้ Node.js เวอร์ชัน 18-alpine (เล็กและเบา) เป็นเบส
FROM node:18-alpine AS builder

# ตั้งค่า Working Directory ภายใน Image
WORKDIR /app

# ก๊อปปี้แค่ package.json และ package-lock.json เข้าไปก่อน
# เพื่อใช้ประโยชน์จาก Docker's layer caching
COPY package*.json ./

# ติดตั้ง dependencies ทั้งหมด
RUN npm install

# ก๊อปปี้โค้ดทั้งหมดของโปรเจกต์เข้าไป
COPY . .

# รัน Prisma generate เพื่อสร้าง Prisma Client
RUN npx prisma generate

# (Optional) ถ้ามีขั้นตอน Build (เช่น TypeScript) ให้ทำตรงนี้
# RUN npm run build

# Stage 2: Production Image
# สร้าง Image ใหม่ที่เล็กกว่าสำหรับใช้งานจริง
FROM node:18-alpine

WORKDIR /app

# ก๊อปปี้แค่ไฟล์ที่จำเป็นจาก Stage 'builder'
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/src ./src

# Expose port ที่แอปของเราทำงานอยู่
EXPOSE 4000

# คำสั่งที่จะรันเมื่อ Container เริ่มทำงาน
CMD ["node", "src/server.js"]