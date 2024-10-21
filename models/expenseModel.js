import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  splitType: { type: String, enum: ['equal', 'exact', 'percentage'], required: true },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amountOwed: { type: Number },
    percentage: { type: Number }
  }],
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
