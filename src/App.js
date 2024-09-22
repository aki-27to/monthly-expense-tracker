import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaPlus, FaUndo, FaChartLine, FaHistory, FaCalculator } from 'react-icons/fa';

const MonthlyExpenseTracker = () => {
  const initialExpenses = [
    { year: 2021, month: 1, amount: 56589 },
    { year: 2021, month: 2, amount: 47687 },
    { year: 2021, month: 3, amount: 66775 },
    { year: 2021, month: 4, amount: 75541 },
    { year: 2021, month: 5, amount: 31094 },
    { year: 2021, month: 6, amount: 73446 },
    { year: 2021, month: 7, amount: 21820 },
    { year: 2021, month: 8, amount: 65788 },
    { year: 2021, month: 9, amount: 50478 },
    { year: 2021, month: 10, amount: 46712 },
    { year: 2021, month: 11, amount: 74889 },
    { year: 2021, month: 12, amount: 108697 },
    { year: 2022, month: 1, amount: 49532 },
    { year: 2022, month: 2, amount: 77501 },
    { year: 2022, month: 3, amount: 7424 },
    { year: 2022, month: 4, amount: 23802 },
    { year: 2022, month: 5, amount: 77080 },
    { year: 2022, month: 6, amount: 46098 },
    { year: 2022, month: 7, amount: 241873 },
    { year: 2022, month: 8, amount: 48238 },
    { year: 2022, month: 9, amount: 182664 },
    { year: 2022, month: 10, amount: 46882 },
    { year: 2022, month: 11, amount: 58575 },
    { year: 2022, month: 12, amount: 289616 },
    { year: 2023, month: 1, amount: 870853 },
    { year: 2023, month: 2, amount: 110462 },
    { year: 2023, month: 3, amount: 107001 },
    { year: 2023, month: 4, amount: 65994 },
    { year: 2023, month: 5, amount: 158509 },
    { year: 2023, month: 6, amount: 120331 },
    { year: 2023, month: 7, amount: 196083 },
    { year: 2023, month: 8, amount: 136580 },
    { year: 2023, month: 9, amount: 249430 },
    { year: 2023, month: 10, amount: 349282 },
    { year: 2023, month: 11, amount: 219572 },
    { year: 2023, month: 12, amount: 200170 },
    { year: 2024, month: 1, amount: 246204 },
    { year: 2024, month: 2, amount: 240645 },
    { year: 2024, month: 3, amount: 249160 },
    { year: 2024, month: 4, amount: 228560 },
    { year: 2024, month: 5, amount: 230879 },
    { year: 2024, month: 6, amount: 197550 },
    { year: 2024, month: 7, amount: 132613 },
    { year: 2024, month: 8, amount: 294655 },
    { year: 2024, month: 9, amount: 395676 }
  ];

  const getCurrentDate = () => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1
    };
  };
  const calculateExpression = (expr) => {
    // 空白を除去し、すべての'-'を'+-'に置換
    expr = expr.replace(/\s/g, '').replace(/-/g, '+-');
    // '+'で分割し、各数値を解析して合計
    const numbers = expr.split('+').map(Number);
    return numbers.reduce((sum, num) => sum + (isNaN(num) ? 0 : num), 0);
  };
  const [expenses, setExpenses] = useState(initialExpenses);
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [amount, setAmount] = useState('');

  const formatCurrency = (value) => {
    if (value === "null") return "未入力";
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
  };

  const calculateAverageExpense = (months) => {
    const sortedExpenses = [...expenses].sort((a, b) => 
      new Date(b.year, b.month - 1) - new Date(a.year, a.month - 1)
    );
    const recentExpenses = sortedExpenses.slice(0, months);
    const sum = recentExpenses.reduce((acc, curr) => acc + (curr.amount === "null" ? 0 : curr.amount), 0);
    return sum / months;
  };

  const calculateFutureExpenses = () => {
    const averageMonthlyExpense = calculateAverageExpense(12);
    return averageMonthlyExpense * 12;
  }; 

  const resetExpense = () => {
    if (window.confirm(`${currentDate.year}年${currentDate.month}月の支出をリセットしますか？`)) {
      const updatedExpenses = expenses.map(expense => {
        if (expense.year === currentDate.year && expense.month === currentDate.month) {
          return { ...expense, amount: 0 };
        }
        return expense;
      });
      setExpenses(updatedExpenses);
    }
  };

  const addExpense = () => {
    if (amount) {
      const calculatedAmount = calculateExpression(amount);
      
      const newExpense = {
        year: currentDate.year,
        month: currentDate.month,
        amount: calculatedAmount
      };
      
      const existingExpenseIndex = expenses.findIndex(
        e => e.year === newExpense.year && e.month === newExpense.month
      );
      
      if (existingExpenseIndex !== -1) {
        const updatedExpenses = [...expenses];
        updatedExpenses[existingExpenseIndex].amount += newExpense.amount;
        setExpenses(updatedExpenses);
      } else {
        setExpenses([...expenses, newExpense]);
      }
      
      setAmount('');
      setCurrentDate(getCurrentDate());
    }
  };

  const chartData = useMemo(() => {
    const sortedExpenses = [...expenses]
      .filter(expense => expense.amount !== 0) // 0でないデータのみをフィルタリング
      .sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1);
        const dateB = new Date(b.year, b.month - 1);
        return dateA - dateB;
      });

    return sortedExpenses.map(expense => ({
      name: `${expense.year}/${expense.month.toString().padStart(2, '0')}`,
      支出: expense.amount,
    }));
  }, [expenses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-12 tracking-tight">
          月次支出管理アプリ
        </h1>
        
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-12 transform transition duration-500 hover:scale-105">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FaPlus className="mr-3 text-indigo-600" /> 支出を追加
          </h2>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/5 px-2 mb-4">
              <input
                type="number"
                value={currentDate.year}
                onChange={(e) => setCurrentDate({...currentDate, year: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                placeholder="年"
              />
            </div>
            <div className="w-full sm:w-1/5 px-2 mb-4">
              <input
                type="number"
                value={currentDate.month}
                onChange={(e) => setCurrentDate({...currentDate, month: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                placeholder="月"
              />
            </div>
            <div className="w-full sm:w-1/5 px-2 mb-4">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                placeholder="金額 (例: 20000+20000)"
              />
            </div>
            <div className="w-full sm:w-1/5 px-2 mb-4">
              <button 
                onClick={addExpense} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
              >
                <FaPlus className="mr-2" /> 追加
              </button>
            </div>
            <div className="w-full sm:w-1/5 px-2 mb-4">
              <button 
                onClick={resetExpense} 
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
              >
                <FaUndo className="mr-2" /> リセット
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-xl shadow-2xl p-8 transform transition duration-500 hover:scale-105">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaCalculator className="mr-3 text-indigo-600" /> 支出分析
            </h2>
            <p className="text-xl text-gray-600 mb-4">直近6ヶ月の平均支出: <span className="font-semibold text-indigo-600">{formatCurrency(calculateAverageExpense(6))}</span></p>
            <p className="text-xl text-gray-600 mb-4">直近1年の平均支出: <span className="font-semibold text-indigo-600">{formatCurrency(calculateAverageExpense(12))}</span></p>
            <p className="text-xl text-gray-600">年間支出予測: <span className="font-semibold text-indigo-600">{formatCurrency(calculateFutureExpenses())}</span></p>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-8 transform transition duration-500 hover:scale-105">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaChartLine className="mr-3 text-indigo-600" /> 支出推移
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  padding={{ left: 30, right: 30 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `日付: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="支出" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 6 }} 
                  activeDot={{ r: 10 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 transform transition duration-500 hover:scale-105">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FaHistory className="mr-3 text-indigo-600" /> 支出履歴
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="p-4 font-bold uppercase text-indigo-600 border-b-2 border-indigo-200">年</th>
                  <th className="p-4 font-bold uppercase text-indigo-600 border-b-2 border-indigo-200">月</th>
                  <th className="p-4 font-bold uppercase text-indigo-600 border-b-2 border-indigo-200">支出</th>
                </tr>
              </thead>
              <tbody>
                {expenses.filter(expense => expense.amount !== 0).sort((a, b) => {
                  const dateA = new Date(a.year, a.month - 1);
                  const dateB = new Date(b.year, b.month - 1);
                  return dateB - dateA; // 降順にソート（最新が上）
                }).map((expense, index) => (
                  <tr key={index} className="hover:bg-indigo-50 transition duration-300">
                    <td className="p-4 border-b border-indigo-100">{expense.year}</td>
                    <td className="p-4 border-b border-indigo-100">{expense.month}</td>
                    <td className="p-4 border-b border-indigo-100 font-semibold text-indigo-600">{formatCurrency(expense.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpenseTracker;