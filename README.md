
# Daily Expenses Sharing Application

## Objective
Design and implement a backend for a daily-expenses sharing application. This application allows users to add expenses and split them based on three different methods: exact amounts, percentages, and equal splits. The application manages user details, validates inputs, and generates downloadable balance sheets.

## Features
- **User Management**: 
  - Each user has an email, name, and mobile number.
- **Expense Management**: 
  - Users can add expenses that can be split using three methods:
    1. **Equal**: Split equally among all participants.
    2. **Exact**: Specify the exact amount each participant owes.
    3. **Percentage**: Specify the percentage each participant owes (ensure percentages add up to 100%).
- **Balance Sheet**:
  - Show individual expenses.
  - Show overall expenses for all users.
  - Provide a feature to download the balance sheet.

## Expense Calculation Examples
1. **Equal**: 
   - **Scenario**: You go out with 3 friends. The total bill is ₹3000. Each friend owes ₹1000.
2. **Exact**: 
   - **Scenario**: You go shopping with 2 friends and pay ₹4299. Friend 1 owes ₹799, Friend 2 owes ₹2000, and you owe ₹1500.
3. **Percentage**: 
   - **Scenario**: You go to a party with 2 friends and one cousin. You owe 50%, Friend 1 owes 25%, and Friend 2 owes 25%.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- pdfmake (for PDF generation)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/shibv/Daily-expenses-sharing-app
   cd Daily-expenses-sharing-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure you have a MongoDB database set up and update the connection details in your environment or configuration files.

## API Endpoints
### User Endpoints
- **Create User**: Add a new user to the application.
- **Retrieve User Details**: Fetch details of a specific user.

### Expense Endpoints
- **Add Expense**: Allow users to add a new expense.
- **Retrieve Individual User Expenses**: Get a list of expenses for a specific user.
- **Retrieve Overall Expenses**: Fetch all expenses recorded in the application.
- **Download Balance Sheet**: Generate and download the overall balance sheet for expenses.

## Data Validation
- Validate user inputs to ensure data integrity.
- Ensure that percentages in the percentage split method add up to 100%.

## Documentation
- Setup and installation instructions are included in this README file.
- Code comments are provided for clarity throughout the codebase.

## Code Overview
### generateOverallBalanceSheet Function
This function performs the following tasks:
- Fetches all expenses from the database, including participant details.
- Calculates individual expenses based on the split type.
- Generates a PDF document with the overall balance sheet.

```javascript
import Expense from '../models/expenseModel.js';
import User from '../models/userModel.js';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import path from 'path';
import fs from 'fs';

pdfMake.vfs = pdfFonts.pdfMake.vfs; // Set the virtual file system

export const generateOverallBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('participants.userId', 'name');
    
    // Prepare table data
    // ... (Rest of the code)
  } catch (error) {
    res.status(500).json({ message: 'Error generating balance sheet', error });
  }
};
```

