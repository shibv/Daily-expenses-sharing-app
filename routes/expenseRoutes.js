import express from 'express';
import { addExpense, getUserExpenses, getAllExpenses, generateBalanceSheet, generateOverallBalanceSheet } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/expenses', addExpense);
router.get('/expenses/user/:userId', getUserExpenses);
router.get('/expenses', getAllExpenses);
router.get('/expenses/balance-sheet/:userId', generateBalanceSheet);
router.get('/expenses/overall-balance-sheet', generateOverallBalanceSheet);


export default router;
