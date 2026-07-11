const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const transactionsList = document.getElementById('transactions');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const exportBtn = document.getElementById('exportBtn');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value;

  if (!text || !amount) return;

  const transaction = {
    id: Date.now(),
    text,
    amount,
    category: categoryInput.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  form.reset();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  renderTransactions();
}

function renderTransactions() {
  transactionsList.innerHTML = '';

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.classList.add(t.amount > 0 ? 'income' : 'expense');
    li.innerHTML = `
<div>
<strong>${t.text}</strong>
<br>
<small>${t.category}</small>
</div>

<div>
<span>${t.amount>0?'+':'-'}₹${Math.abs(t.amount)}</span>

<button onclick="deleteTransaction(${t.id})">
Delete
</button>
</div>
`;
    transactionsList.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, amt) => acc + amt, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expense = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0).toFixed(2);

  balanceEl.textContent = `₹${total}`;
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${Math.abs(expense)}`;
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function exportCSV() {

  let csv = "Description,Category,Amount\n";

  transactions.forEach(t => {
    csv += `${t.text},${t.category},${t.amount}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "Expense_Report.csv";
  a.click();
  URL.revokeObjectURL(url);

}

form.addEventListener('submit', addTransaction);
exportBtn.addEventListener("click", exportCSV);
renderTransactions();