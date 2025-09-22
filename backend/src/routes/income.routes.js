const express = require('express');
const incomeController = require('../controllers/income.controller'); // <-- แก้ตรงนี้
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.use(authenticateToken);

router.route('/')
  .get(incomeController.getIncomes)       
  .post(incomeController.createIncome);     // <-- แก้ตรงนี้

router.route('/:id')
  .get(incomeController.getIncomeById)
  .put(incomeController.updateIncome)     // <-- แก้ตรงนี้
  .delete(incomeController.deleteIncome);   // <-- แก้ตรงนี้

module.exports = router;