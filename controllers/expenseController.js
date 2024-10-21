import Expense from '../models/expenseModel.js';

import fs from 'fs';
import path from 'path';
import User from '../models/userModel.js';

import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';


pdfMake.vfs = pdfFonts.pdfMake.vfs; // the virtual file system

export const addExpense = async (req, res) => {
  try {
    const { amount, splitType, participants } = req.body;
    const expense = new Expense({ amount, splitType, participants });
    await expense.save();
    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error });
  }
};

export const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ 'participants.userId': req.params.userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
};



// Function to create balance sheet for a user
// export const generateBalanceSheet = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const expenses = await Expense.find({ 'participants.userId': userId });

//     if (!expenses.length) {
//       return res.status(404).json({ message: 'No expenses found for this user' });
//     }

//     // Create PDF
//     const doc = new PDFDocument();
//     const filePath = path.resolve(`./balance-sheets/balance-sheet-${userId}.pdf`);
//     doc.pipe(fs.createWriteStream(filePath));

//     doc.fontSize(25).text('Balance Sheet', { align: 'center' });
//     doc.moveDown();

//     doc.fontSize(18).text('User Expenses:', { underline: true });
//     expenses.forEach(exp => {
//       doc.text(`Expense ID: ${exp._id}`);
//       doc.text(`Amount: ${exp.amount}`);
//       doc.text(`Split Type: ${exp.splitType}`);
//       doc.text('Participants:');
//       exp.participants.forEach(participant => {
//         doc.text(`- User ID: ${participant.userId}, Amount Owed: ${participant.amountOwed || ''}, Percentage: ${participant.percentage || ''}`);
//       });
//       doc.moveDown();
//     });

//     doc.end();

//     res.status(200).json({ message: 'Balance sheet generated', filePath });
//   } catch (error) {
//     res.status(500).json({ message: 'Error generating balance sheet', error });
//   }
// };


export const generateOverallBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('participants.userId', 'name');

    if (!expenses.length) {
      return res.status(404).json({ message: 'No expenses found' });
    }

    // Prepare table data // Header Row
    const tableBody = [['Expense #', 'User', 'Individual Amount']]; 

    expenses.forEach((exp, index) => {
      const numParticipants = exp.participants.length; 
      let individualAmount = 0;

      exp.participants.forEach(participant => {
        
        if (exp.splitType === 'equal') {
          individualAmount = (exp.amount / numParticipants).toFixed(2);
        } else if (exp.splitType === 'exact') {
          individualAmount = participant.amountOwed; 
        } else if (exp.splitType === 'percentage') {
          individualAmount = ((exp.amount * participant.percentage) / 100).toFixed(2);
        }

        // Add a row for each participant
        tableBody.push([
          `Expense ${index + 1}`, 
          participant.userId.name || 'Unknown', 
          `₹${individualAmount}` 
        ]);
      });
    });

    // Define PDF document
    const docDefinition = {
      content: [
        { text: 'Overall Balance Sheet', style: 'header' },
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: tableBody,
          },
          layout: 'lightHorizontalLines', 
        },
      ],
      styles: {
        header: {
          fontSize: 25,
          bold: true,
          alignment: 'center',
        },
      },
    };

    // Create PDF and save it
    const pdfDoc = pdfMake.createPdf(docDefinition);
    const filePath = path.resolve('./balance-sheets/overall-balance-sheet.pdf');

    pdfDoc.getBuffer((buffer) => {
      fs.writeFileSync(filePath, buffer);
      res.status(200).json({ message: 'Overall balance sheet generated', filePath });
    });

  } catch (error) {
    res.status(500).json({ message: 'Error generating balance sheet', error });
  }
};





export const generateBalanceSheet = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId); 
    const expenses = await Expense.find({ 'participants.userId': userId }).populate('participants.userId', 'name');

    if (!user || !expenses.length) {
      return res.status(404).json({ message: 'No expenses found for this user' });
    }

    
    const tableData = {
      headers: ['Expense #', 'Total Amount', 'Amount Owed'],
      rows: [],
    };

    let totalUserExpense = 0; 
    let expenseIndex = 1; 

    
    expenses.forEach(exp => {
      const userParticipant = exp.participants.find(p => p.userId._id.toString() === userId);

      if (!userParticipant) return; 

 
      let userAmountOwed;
      if (exp.splitType === 'equal') {
        userAmountOwed = (exp.amount / exp.participants.length).toFixed(2);
      } else if (exp.splitType === 'exact') {
        userAmountOwed = userParticipant.amountOwed;
      } else if (exp.splitType === 'percentage') {
        userAmountOwed = ((exp.amount * userParticipant.percentage) / 100).toFixed(2);
      }

      totalUserExpense += parseFloat(userAmountOwed); 

     
      tableData.rows.push([`${expenseIndex}`, `₹${exp.amount}`, `₹${userAmountOwed}`]);
      expenseIndex++;
    });

    tableData.rows.push([
      { text: 'Total', colSpan: 2, alignment: 'right' },
      '',
      `₹${totalUserExpense}`
    ]);

    // Define PDF document
    const docDefinition = {
      content: [
        { text: `Expense Sheet for ${user.name}`, style: 'header' },
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: [
              tableData.headers,
              ...tableData.rows.map(row => row.map(cell => ({ text: cell, alignment: 'center' })))
            ],
          },
          layout: 'lightHorizontalLines', 
        },
      ],
      styles: {
        header: {
          fontSize: 25,
          bold: true,
          alignment: 'center',
        },
      },
    };

    // Create PDF and save it
    const pdfDoc = pdfMake.createPdf(docDefinition);
    const filePath = path.resolve(`./balance-sheets/balance-sheet-${userId}.pdf`);
    
    pdfDoc.getBuffer((buffer) => {
      fs.writeFileSync(filePath, buffer);
      res.status(200).json({ message: 'Balance sheet generated', filePath });
    });

  } catch (error) {
    res.status(500).json({ message: 'Error generating balance sheet', error: error.message });
  }
};


