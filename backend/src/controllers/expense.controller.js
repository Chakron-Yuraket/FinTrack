const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.createExpense = async (req, res) => {
  const userId = req.user.userId;
  const { name, amount, category, date, note, receiptUrl } = req.body;

  if (!name || !amount || !category || !date) {
    return res.status(400).json({ message: "Name, amount, category, and date are required." });
  }

  try {
    const newExpense = await prisma.expense.create({
      data: {
        userId, 
        name,
        amount: parseFloat(amount), 
        category,
        date: new Date(date), 
        note,
        receiptUrl,
      },
    });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  const userId = req.user.userId;

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId: userId, 
      },
      orderBy: {
        date: 'desc', 
      },
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.getExpenseById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const expense = await prisma.expense.findUnique({
      where: { id: id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // ตรวจสอบว่าเป็นเจ้าของข้อมูลจริง
    if (expense.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { name, amount, category, date, note, receiptUrl } = req.body;

  try {
    // ตรวจสอบก่อนว่า expense ที่จะแก้ เป็นของ user คนนี้จริงๆ
    const expenseToUpdate = await prisma.expense.findUnique({ where: { id } });
    if (!expenseToUpdate) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expenseToUpdate.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        name,
        amount: amount ? parseFloat(amount) : undefined,
        category,
        date: date ? new Date(date) : undefined,
        note,
        receiptUrl,
      },
    });
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params; // ดึง id ของ expense ที่จะลบมาจาก URL
  const userId = req.user.userId; // ดึง userId ของคนที่ล็อคอินอยู่

  try {
    // [OWASP Security] ตรวจสอบก่อนว่า expense ที่จะลบ เป็นของ user คนนี้จริงๆ
    const expense = await prisma.expense.findUnique({
      where: { id: id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    if (expense.userId !== userId) {
      // ถ้าพยายามลบของคนอื่น
      return res.status(403).json({ message: "Forbidden: You do not have permission to delete this expense." });
    }

    // ถ้าทุกอย่างถูกต้อง ก็สั่งลบ
    await prisma.expense.delete({
      where: { id: id },
    });

    res.status(204).send(); // ตอบกลับว่าสำเร็จ แต่ไม่มีเนื้อหา (No Content)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};