const loginBox = document.getElementById("loginBox");

const usernameInput = document.getElementById("username");

const loginBtn = document.getElementById("loginBtn");

const logoutBtn = document.getElementById("logoutBtn");

const app = document.getElementById("app");
const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const transactionsList = document.getElementById('transactions');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const exportBtn = document.getElementById('exportBtn');

let currentUser = localStorage.getItem("currentUser");


let transactions = currentUser 
? JSON.parse(localStorage.getItem(currentUser)) || []
: [];
let previousBalance = 0;

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
    <span>
      ${t.amount > 0 ? '+' : '-'}₹${Math.abs(t.amount)}
    </span>

    <button onclick="deleteTransaction(${t.id})">
      Delete
    </button>
  </div>
`;
    transactionsList.appendChild(li);
  });

  updateSummary();
}

function exportCSV() {

  if (transactions.length === 0) {
    alert("No transactions available");
    return;
  }


  let csv = "Description,Amount,Category\n";


  transactions.forEach(transaction => {

    csv += `${transaction.text},${transaction.amount},${transaction.category}\n`;

  });


  const blob = new Blob([csv], {
    type: "text/csv"
  });


  const url = URL.createObjectURL(blob);


  const link = document.createElement("a");

  link.href = url;

  link.download = "expense-report.csv";


  link.click();

}

exportBtn.addEventListener("click", exportCSV);

function updateSummary() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, amt) => acc + amt, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expense = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0).toFixed(2);

  balanceEl.textContent = `₹${total}`;
  const currentBalance = Number(total);

balanceEl.classList.remove("balance-up", "balance-down");

if (currentBalance > previousBalance) {
  balanceEl.classList.add("balance-up");
} else if (currentBalance < previousBalance) {
  balanceEl.classList.add("balance-down");
}

setTimeout(() => {
  balanceEl.classList.remove("balance-up", "balance-down");
}, 500);

previousBalance = currentBalance;
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${Math.abs(expense)}`;
}

function updateLocalStorage(){

localStorage.setItem(
currentUser,
JSON.stringify(transactions)
);

}

form.addEventListener('submit', addTransaction);


loginBtn.addEventListener("click",()=>{


let username = usernameInput.value.trim();


if(username===""){
 alert("Enter username");
 return;
}


localStorage.setItem(
"currentUser",
username
);


currentUser=username;


transactions =
JSON.parse(localStorage.getItem(username)) || [];


loginBox.style.display="none";


app.style.display="block";


renderTransactions();


});

logoutBtn.addEventListener("click",()=>{


localStorage.removeItem(
"currentUser"
);


location.reload();


});

if(currentUser){

loginBox.style.display="none";

app.style.display="block";

renderTransactions();

}