const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.createIncome = async (req, res) => {
  const userId = req.user.userId;
  const { name, amount, category, date, note } = req.body;
  if (!name || !amount || !category || !date) {
    return res.status(400).json({ message: "Name, amount, category, and date are required." });
  }
  try {
    const newIncome = await prisma.income.create({
      data: {
        userId,
        name,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        note,
      },
    });
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.getIncomes = async (req, res) => {
  const userId = req.user.userId;
  try {
    const incomes = await prisma.income.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// --- ดึงรายรับชิ้นเดียวตาม ID (Read by ID) ---
exports.getIncomeById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const income = await prisma.income.findUnique({ where: { id } });
    if (!income) { return res.status(404).json({ message: "Income not found" }); }
    if (income.userId !== userId) { return res.status(403).json({ message: "Forbidden" }); }
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { name, amount, category, date, note } = req.body;
  try {
    const incomeToUpdate = await prisma.income.findUnique({ where: { id } });
    if (!incomeToUpdate) { return res.status(404).json({ message: "Income not found" }); }
    if (incomeToUpdate.userId !== userId) { return res.status(403).json({ message: "Forbidden" }); }
    
    const updatedIncome = await prisma.income.update({
      where: { id },
      data: { name, amount: amount ? parseFloat(amount) : undefined, category, date: date ? new Date(date) : undefined, note },
    });
    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", errormessage: error.message });
  }
};
exports.deleteIncome = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const income = await prisma.income.findUnique({ where: { id: id } });
    if (!income) {
      return res.status(404).json({ message: "Income not found." });
    }
    if (income.userId !== userId) {
      return res.status(403).json({ message: "Forbidden." });
    }
    await prisma.income.delete({ where: { id: id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};