import React from 'react';

// Component นี้รับ props 3 อย่าง: title, amount, และ color
function StatCard({ title, amount, colorClass }) {
    // ฟังก์ชันสำหรับ format ตัวเลขให้มี comma (เช่น 12500 -> 12,500.00)
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'THB', // หรือ 'THB' ก็ได้
    }).format(amount);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className={`text-3xl font-bold mt-2 ${colorClass}`}>
                {formattedAmount}
            </p>
        </div>
    );
}

export default StatCard;