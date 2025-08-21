// Save data to localStorage
function saveData() {
  const tableData = [];
  document.querySelectorAll("#trackerTable tbody tr").forEach(row => {
    const rowData = [];
    row.querySelectorAll("td").forEach((cell, index) => {
      if (index === 4) { // Last Updated column
        rowData.push(cell.getAttribute("data-timestamp") || new Date().toISOString());
      } else if (index < 5) {
        rowData.push(cell.innerText);
      }
    });
    tableData.push(rowData);
  });
  localStorage.setItem("trackerData", JSON.stringify(tableData));
}

// Helper function to get "time ago" string
function timeAgo(timestamp) {
  const now = new Date();
  const diff = now - timestamp; // difference in milliseconds
  const mins = Math.floor(diff / 1000 / 60);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// Add row (editable cells: coins, voucher, item)
function addRow(accountName = "", coinsVal = "0", voucherVal = "-", itemVal = "-", lastUpdate = null) {
  const tableBody = document.querySelector("#trackerTable tbody");
  const row = document.createElement("tr");

  // Account (fixed)
  const account = document.createElement("td");
  account.innerText = accountName;

  // Coins (numbers only)
  const coins = document.createElement("td");
  coins.contentEditable = true;
  coins.innerText = coinsVal;
  coins.addEventListener("input", () => {
    coins.innerText = coins.innerText.replace(/[^0-9]/g, "");
    updateTimestamp();
  });

  // Voucher
  const voucher = document.createElement("td");
  voucher.contentEditable = true;
  voucher.innerText = voucherVal;

  // Item Bought
  const item = document.createElement("td");
  item.contentEditable = true;
  item.innerText = itemVal;

  // Last Updated
  const lastUpdated = document.createElement("td");
  let updatedTime = lastUpdate ? new Date(lastUpdate) : new Date();
  lastUpdated.setAttribute("data-timestamp", updatedTime.toISOString());
  lastUpdated.innerText = timeAgo(updatedTime);

  // Action
  const action = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "❌";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.disabled = true; // fixed accounts cannot be deleted
  action.appendChild(deleteBtn);

  // Update timestamp on edit
  function updateTimestamp() {
    updatedTime = new Date();
    lastUpdated.setAttribute("data-timestamp", updatedTime.toISOString());
    lastUpdated.innerText = timeAgo(updatedTime);
    saveData();
  }

  [coins, voucher, item].forEach(cell => {
    cell.addEventListener("input", updateTimestamp);
  });

  [account, coins, voucher, item, lastUpdated, action].forEach(cell => row.appendChild(cell));
  tableBody.appendChild(row);
  saveData();

  // Update "time ago" every minute
  setInterval(() => {
    lastUpdated.innerText = timeAgo(updatedTime);
  }, 60000);
}

// Reset all coins, voucher, item and update Last Updated
function resetAll() {
  document.querySelectorAll("#trackerTable tbody tr").forEach(row => {
    const cells = row.querySelectorAll("td");
    cells[1].innerText = "0";   // Coins
    cells[2].innerText = "-";   // Voucher
    cells[3].innerText = "-";   // Item Bought
    const now = new Date();
    cells[4].setAttribute("data-timestamp", now.toISOString());
    cells[4].innerText = timeAgo(now);
  });
  saveData();
}

// Load saved data or default accounts
window.onload = () => {
  const savedData = JSON.parse(localStorage.getItem("trackerData"));
  if (savedData && savedData.length > 0) {
    savedData.forEach(rowData => addRow(...rowData));
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

// Add Account button functionality
document.getElementById("addAccount").addEventListener("click", () => {
  const newAcc = document.getElementById("newAccountInput").value.trim();
  if (newAcc) {
    addRow(newAcc);
    document.getElementById("newAccountInput").value = "";
  }
});

// Reset All button
document.getElementById("resetAll").addEventListener("click", resetAll);
