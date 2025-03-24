// read file data.js
import { type1, type2, type3, type4, type5 } from "./data.js";

const row = document.querySelector(".row");

const data = [type1, type2, type3, type4, type5];

// main logic
let name = "";
let id = "";
const offenses = [];
let charges = 0;
const flatten = data.flat();

const addOffense = (id) => {
  const item = flatten.find((item) => item.id === id);
  offenses.push(item);
  charges += item.point;
  item.isSelected = !item.isSelected;

  // update UI
  document.querySelector("#charges").innerHTML = charges;
  document.querySelector("#offenses").innerHTML = offenses
    .map((item) => item.name)
    .join(" + ");
};

function copyToClipboard() {
  const text = offenses.map((item) => item.name).join(" + ");
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard:", text);
    })
    .catch((err) => {
      console.error("Failed to copy text:", err);
    });
}

window.addOffense = addOffense;
window.copyToClipboard = copyToClipboard;

// render logic

data.forEach((type, index) => {
  let content = "";
  type.forEach((item) => {
    content += `
            <tr>
                <td>${item.name}</td>
                <td>
                    <div class="number-checkbox">
                        <input
                        type="number"
                        value="${item.quantity}"
                        style="width: 48px; height: 32px"
                        />
                        <input type="checkbox" onclick="addOffense('${item.id}')"/>
                    </div>
                </td>
            </tr>
        `;
  });

  const collapsible = `<div class="collapsible">
          <div class="collapsible-header">
            <h3 class="collapsible-title">Cấp độ ${index + 1}</h3>
            <svg
              class="collapsible-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </div>
          <div class="collapsible-content">
            <table>
              <thead>
                <tr>
                  <th>Tội danh</th>
                  <th>Chọn</th>
                </tr>
              </thead>
              <tbody id="tbody-${index}">
                ${content}
              </tbody>
            </table>
          </div>
        </div>`;

  row.innerHTML += collapsible;
});
