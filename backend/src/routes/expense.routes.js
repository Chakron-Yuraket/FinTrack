const express = require('express');
const expenseController = require('../controllers/expense.controller');
const authenticateToken = require('../middleware/authenticateToken'); // <-- Import ยามเข้ามา

const router = express.Router();

router.use(authenticateToken);

router.route('/')
  .get(expenseController.getExpenses)
  .post(expenseController.createExpense);

router.route('/:id')
  .get(expenseController.getExpenseById) // <-- เพิ่มบรรทัดนี้
  .put(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

module.exports = router;