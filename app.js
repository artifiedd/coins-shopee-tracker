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

  // Account
  const account = document.createElement("td");
  account.innerText = accountName;

  // Coins (numbers only input)
  const coins = document.createElement("td");
  const coinsInput = document.createElement("input");
  coinsInput.type = "number";
  coinsInput.min = 0;
  coinsInput.value = coinsVal;
  coinsInput.addEventListener("input", updateTimestamp);
  coins.appendChild(coinsInput);

  // Voucher (editable)
  const voucher = document.createElement("td");
  voucher.contentEditable = true;
  voucher.innerText = voucherVal;
  voucher.addEventListener("input", updateTimestamp);

  // Item Bought (editable)
  const item = document.createElement("td");
  item.contentEditable = true;
  item.innerText = itemVal;
  item.addEventListener("input", updateTimestamp);

  // Last Updated
  const lastUpdated = document.createElement("td");
  lastUpdated.innerText = lastUpdate || new Date().toLocaleString();

  // Action
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
    cells[1].querySelector("input").value = "0"; // Coins
    cells[2].innerText = "-";                     // Voucher
    cells[3].innerText = "-";                     // Item Bought
    cells[4].innerText = new Date().toLocaleString(); // Last Updated
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

document.getElementById("addAccount").addEventListener("click", () => {
  const accountName = prompt("Enter new account name:");
  if (!accountName) return;
  addRow(accountName, "0", "-", "-", null, false);
});
