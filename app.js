// Save data to localStorage
function saveData() {
  const tableData = [];
  document.querySelectorAll("#trackerTable tbody tr").forEach(row => {
    const rowData = [];
    const cells = row.querySelectorAll("td");
    rowData.push(cells[0].innerText); // Account
    rowData.push(cells[1].querySelector("input").value); // Coins
    rowData.push(cells[2].innerText); // Voucher
    rowData.push(cells[3].innerText); // Item Bought
    rowData.push(cells[4].innerText); // Last Updated
    rowData.push(cells[5].querySelector("button").disabled ? "fixed" : "extra");
    tableData.push(rowData);
  });
  localStorage.setItem("trackerData", JSON.stringify(tableData));
}

// Add row function
function addRow(accountName = "", coinsVal = "0", voucherVal = "-", itemVal = "-", lastUpdate = null, isFixed = true) {
  const tableBody = document.querySelector("#trackerTable tbody");
  const row = document.createElement("tr");

  const account = document.createElement("td");
  account.innerText = accountName;
  account.setAttribute("data-label", "Account");

  const coins = document.createElement("td");
  const coinsInput = document.createElement("input");
  coinsInput.type = "number";
  coinsInput.min = 0;
  coinsInput.value = coinsVal;
  coinsInput.addEventListener("input", updateTimestamp);
  coins.appendChild(coinsInput);
  coins.setAttribute("data-label", "Coins");

  const voucher = document.createElement("td");
  voucher.contentEditable = true;
  voucher.innerText = voucherVal;
  voucher.addEventListener("input", updateTimestamp);
  voucher.setAttribute("data-label", "Voucher");

  const item = document.createElement("td");
  item.contentEditable = true;
  item.innerText = itemVal;
  item.addEventListener("input", updateTimestamp);
  item.setAttribute("data-label", "Item Bought");

  const lastUpdated = document.createElement("td");
  lastUpdated.innerText = lastUpdate || new Date().toLocaleString();
  lastUpdated.setAttribute("data-label", "Last Updated");

  const action = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerText = "❌";
  if (isFixed) {
    deleteBtn.disabled = true;
  } else {
    deleteBtn.addEventListener("click", () => {
      row.remove();
      saveData();
    });
  }
  action.appendChild(deleteBtn);
  action.setAttribute("data-label", "Action");

  function updateTimestamp() {
    lastUpdated.innerText = new Date().toLocaleString();
    saveData();
  }

  [account, coins, voucher, item, lastUpdated, action].forEach(cell => row.appendChild(cell));
  tableBody.appendChild(row);
  saveData();
}

// Reset All
function resetAll() {
  document.querySelectorAll("#trackerTable tbody tr").forEach(row => {
    const cells = row.querySelectorAll("td");
    cells[1].querySelector("input").value = "0";
    cells[2].innerText = "-";
    cells[3].innerText = "-";
    cells[4].innerText = new Date().toLocaleString();
  });
  saveData();
}

// Load data or defaults
window.onload = () => {
  const savedData = JSON.parse(localStorage.getItem("trackerData"));
  if (savedData && savedData.length > 0) {
    savedData.forEach(rowData => {
      const isFixed = rowData[5] === "fixed";
      addRow(rowData[0], rowData[1], rowData[2], rowData[3], rowData[4], isFixed);
    });
  } else {
    const defaultAccounts = [
      "amalanmulia",
      "daisy4ever_",
      "killjoymain5ever",
      "mohdmaheran",
      "pricesssuwek",
      "facebook twinkledream",
      "apple"
    ];
    defaultAccounts.forEach(acc => addRow(acc));
  }
};

// Event listeners
document.getElementById("resetAll").addEventListener("click", resetAll);

const addBtn = document.getElementById("addAccount");
const input = document.getElementById("newAccountInput");

addBtn.addEventListener("click", () => {
  const accountName = input.value.trim();
  if (!accountName) return;
  addRow(accountName, "0", "-", "-", null, false);
  input.value = ""; // clear input after adding
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});
