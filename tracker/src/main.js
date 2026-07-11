// ==========================
// SELECT ELEMENTS
// ==========================


const loginBox = document.getElementById("loginBox");

const usernameInput = document.getElementById("username");

const loginBtn = document.getElementById("loginBtn");

const logoutBtn = document.getElementById("logoutBtn");

const app = document.getElementById("app");


const form = document.getElementById("form");

const textInput = document.getElementById("text");

const amountInput = document.getElementById("amount");

const categoryInput = document.getElementById("category");


const transactionsList =
document.getElementById("transactions");


const balanceEl =
document.getElementById("balance");


const incomeEl =
document.getElementById("income");


const expenseEl =
document.getElementById("expense");


const exportBtn =
document.getElementById("exportBtn");


const searchInput =
document.getElementById("search");


const filterInput =
document.getElementById("filter");


const clearBtn =
document.getElementById("clearBtn");


const themeBtn =
document.getElementById("themeBtn");


const userName =
document.getElementById("userName");



// ==========================
// LOCAL STORAGE
// ==========================


let currentUser =
localStorage.getItem("currentUser");


let transactions =
currentUser
?
JSON.parse(localStorage.getItem(currentUser)) || []
:
[];



// ==========================
// LOGIN
// ==========================


loginBtn.addEventListener("click",()=>{


let username =
usernameInput.value.trim();



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


userName.innerText=username;


renderTransactions();



});



// ==========================
// AUTO LOGIN
// ==========================


if(currentUser){


loginBox.style.display="none";


app.style.display="block";


userName.innerText=currentUser;


renderTransactions();


}



// ==========================
// LOGOUT
// ==========================


logoutBtn.addEventListener("click",()=>{


localStorage.removeItem(
"currentUser"
);


location.reload();


});



// ==========================
// ADD TRANSACTION
// ==========================


form.addEventListener(
"submit",
function(e){


e.preventDefault();



let text =
textInput.value.trim();


let amount =
Number(amountInput.value);



if(text==="" || amount===0){

alert("Enter valid details");

return;

}



const transaction={


id:Date.now(),


text:text,


amount:amount,


category:
categoryInput.value,


date:
new Date().toLocaleDateString()


};



transactions.push(transaction);



saveData();


renderTransactions();


form.reset();


showToast(
"Transaction Added Successfully"
);



});




// ==========================
// DISPLAY TRANSACTIONS
// ==========================


function renderTransactions(){


transactionsList.innerHTML="";



let search =
searchInput.value.toLowerCase();



let filter =
filterInput.value;



let filtered =
transactions.filter(t=>{


let matchSearch =
t.text
.toLowerCase()
.includes(search);



let matchFilter =

filter==="all"
||
(filter==="income" && t.amount>0)
||
(filter==="expense" && t.amount<0);



return matchSearch && matchFilter;


});




if(filtered.length===0){


transactionsList.innerHTML=
`
<li class="empty">

No Transactions Found

</li>
`;

return;

}




filtered.forEach(t=>{


const li =
document.createElement("li");



li.className =
t.amount>0
?
"income"
:
"expense";



li.innerHTML=

`

<div>


<strong>

${t.text}

</strong>


<br>


<small>

${t.category}

</small>


<br>


<small>

${t.date}

</small>


</div>



<div>


<span>

${t.amount>0?"+":"-"}
₹${Math.abs(t.amount)}

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



// ==========================
// DELETE
// ==========================


function deleteTransaction(id){


transactions =
transactions.filter(
t=>t.id!==id
);



saveData();


renderTransactions();


showToast(
"Transaction Deleted"
);


}




// ==========================
// SUMMARY
// ==========================


function updateSummary(){



let income =
transactions
.filter(t=>t.amount>0)
.reduce(
(sum,t)=>sum+t.amount,
0
);



let expense =
transactions
.filter(t=>t.amount<0)
.reduce(
(sum,t)=>sum+t.amount,
0
);



let balance =
income+expense;



balanceEl.innerText=
`₹${balance.toFixed(2)}`;



incomeEl.innerText=
`₹${income.toFixed(2)}`;



expenseEl.innerText=
`₹${Math.abs(expense).toFixed(2)}`;



}



// ==========================
// SAVE DATA
// ==========================


function saveData(){


localStorage.setItem(

currentUser,

JSON.stringify(transactions)

);


}



// ==========================
// SEARCH
// ==========================


searchInput.addEventListener(
"input",
renderTransactions
);



// ==========================
// FILTER
// ==========================


filterInput.addEventListener(
"change",
renderTransactions
);



// ==========================
// CLEAR HISTORY
// ==========================


clearBtn.addEventListener(
"click",
()=>{


if(
confirm(
"Delete all transactions?"
)
){


transactions=[];


saveData();


renderTransactions();


showToast(
"History Cleared"
);


}


});



// ==========================
// EXPORT CSV
// ==========================


exportBtn.addEventListener(
"click",
()=>{


if(transactions.length===0){

alert(
"No data available"
);

return;

}



let csv=
"Description,Amount,Category,Date\n";



transactions.forEach(t=>{


csv +=
`${t.text},${t.amount},${t.category},${t.date}\n`;


});



let blob =
new Blob(
[csv],
{
type:"text/csv"
}
);



let url =
URL.createObjectURL(blob);



let link =
document.createElement("a");


link.href=url;


link.download=
"expense-report.csv";


link.click();


});



// ==========================
// DARK MODE
// ==========================


themeBtn.addEventListener(
"click",
()=>{


document.body.classList.toggle(
"dark-mode"
);



if(
document.body.classList.contains(
"dark-mode"
)
){

themeBtn.innerText=
"☀️ Light Mode";


}

else{


themeBtn.innerText=
"🌙 Dark Mode";


}



});




// ==========================
// TOAST MESSAGE
// ==========================


function showToast(message){


let toast =
document.createElement("div");



toast.innerText=message;


toast.style.position="fixed";

toast.style.bottom="30px";

toast.style.right="30px";

toast.style.background="#2563eb";

toast.style.color="white";

toast.style.padding="15px 20px";

toast.style.borderRadius="10px";

toast.style.zIndex="999";



document.body.appendChild(toast);



setTimeout(()=>{


toast.remove();


},2000);



}