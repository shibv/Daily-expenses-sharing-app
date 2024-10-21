import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

// Initialize express app
const app = express();

// Connect to the database
connectDB();

// Middlewares
app.use(express.json());  // for parsing JSON request bodies
app.use('/api', userRoutes);
app.use('/api', expenseRoutes);

// Error handler
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Welcome to the Daily Expenses Sharing Application API!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

