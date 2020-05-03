const totalValue = document.querySelector("#total");
const incomeValue = document.querySelector("#income");
const expenseValue = document.querySelector("#expense");
const form = document.querySelector("#form");
const inputName = document.querySelector("#name");
const inputAmount = document.querySelector("#valueItem");
const transactionsList = document.querySelector(".transactions-list");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactionsArray =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

const handleDelete = idArray => {
  transactionsArray = transactionsArray.filter(({ id }) => id !== idArray);
  init();
  updateLocalStorage();
};

const insertTransactionsIntoDOM = ({ id, name, amount }) => {
  const operator = amount < 0 ? "-" : "";
  const cssClass = amount < 0 ? "minus" : "plus";
  const valueWithoutMinus = Math.abs(amount).toFixed("2");
  const li = document.createElement("li");
  li.classList.add(cssClass);
  li.innerHTML = `
    <span>${name}</span>
    <span>R$ ${operator}${valueWithoutMinus}</span>
    <button type="button" onClick="handleDelete(${id})">X</button>
  `;

  transactionsList.prepend(li);
};

const updateTotal = transactionsArray =>
  transactionsArray.reduce((total, amount) => total + amount, 0).toFixed("2");

const updateIncome = transactionsArray =>
  transactionsArray
    .filter(amount => amount > 0)
    .reduce((total, amount) => total + amount, 0)
    .toFixed("2");

const updateExpense = transactionsArray =>
  transactionsArray
    .filter(amount => amount < 0)
    .reduce((total, amount) => total + amount, 0)
    .toFixed("2");

const updateBalance = transactionsArray => {
  const arrayAmount = transactionsArray.map(({ amount }) => amount);
  const total = updateTotal(arrayAmount);
  const income = updateIncome(arrayAmount);
  const expense = updateExpense(arrayAmount);

  totalValue.textContent = `R$ ${total}`;
  incomeValue.textContent = `R$ ${income}`;
  expenseValue.textContent = `R$ ${expense}`;
};

const insertAllTransactions = transactionsArray => {
  transactionsArray.forEach(insertTransactionsIntoDOM);
};

const init = () => {
  transactionsList.innerHTML = "";
  insertAllTransactions(transactionsArray);
  updateBalance(transactionsArray);
};

init();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactionsArray));
};

const id = () => Math.floor(Math.random() * 1000);

const addTransactionArray = (name, amount) => {
  transactionsArray.push({ id: id(), name, amount });
};

const clearInput = () => {
  inputName.value = "";
  inputAmount.value = "";
};

const handleSubmit = event => {
  event.preventDefault();

  const name = inputName.value.trim();
  const amount = +inputAmount.value.trim();
  const isInputEmpty = name === "" || amount === "";

  if (isInputEmpty) {
    alert("preencha todas as informações");
    return;
  }

  addTransactionArray(name, amount);
  clearInput();

  init();
  updateLocalStorage();
};

form.addEventListener("submit", handleSubmit);
