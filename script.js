// read file data.js
import { type1, type2, type3, type4, type5 } from "./data.js";

const row = document.querySelector(".row");

const data = [type1, type2, type3, type4, type5];

// main logic
let name = "";
let id = "";
let offenses = [];
let charges = 0;
const flatten = data.flat();
let currAddedItems = [];

function calSum() {
  // reset
  offenses = [];
  charges = 0;
  currAddedItems.forEach((item) => {
    offenses.push(item);
    charges += item.point * item.quantity;
  });
}

function render() {
  // update UI
  document.querySelector("#charges").innerHTML = charges;
  document.querySelector("#offenses").innerHTML = offenses
    .map((item) => item.name)
    .join(" + ");
}

const addOffense = (id) => {
  console.log(id);
  const item = flatten.find((item) => item.id === id);
  item.isSelected = !item.isSelected;

  if (item.isSelected) {
    currAddedItems.push(item);
  } else {
    currAddedItems = currAddedItems.filter((item) => item.id !== id);
  }

  calSum();

  render();
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

function getName() {
  name = document.querySelector("#name").value;
  document.querySelector("#name-value").innerHTML = name;
}

function getCccd() {
  id = document.querySelector("#cccd").value;
  document.querySelector("#cccd-value").innerHTML = id;
}

function increase(id, value) {
  console.log("increase", id, value);
  const item = flatten.find((item) => item.id === id);
  item.quantity = parseInt(value);
  calSum();
  render();
}

function addRule(rule) {
  const item = currAddedItems.find((item) => item.id === rule);

  if (item) {
    currAddedItems = currAddedItems.filter((item) => item.id !== rule);
    calSum();
    render();
    return;
  }

  let newItem = {};
  switch (rule) {
    case "military":
      // newItem = {
      //   id: "military",
      //   name: "Có giấy nghĩa vụ",
      //   quantity: 1,
      //   isSelected: true,
      //   point: 20,
      //   type: 0,
      // };
      break;
    case "weapons":
      newItem = {
        id: "weapons",
        name: "Tàng trữ vũ khí nóng trái phép",
        quantity: 1,
        isSelected: true,
        point: 50,
        type: 0,
      };
      break;
    case "cooperation":
      const coop = document.querySelector("#cooperation-num").value;
      newItem = {
        id: "cooperation",
        name: `(Giảm ${coop} phút hợp tác)`,
        quantity: 1,
        isSelected: true,
        point: -parseInt(coop),
        type: 0,
      };
      break;
    case "violation":
      if (currAddedItems.find((item) => item.type === 1)) {
        const violationBox = document.querySelector("#violation");
        violationBox.checked = false;
        return;
      }
      const violate = document.querySelector("#violation-num").value;
      newItem = {
        id: "violation",
        name: `Vi phạm luật người tiêu dùng (${violate} bill)`,
        quantity: parseInt(violate),
        isSelected: true,
        point: 5,
        type: 0,
      };
      break;
    default:
      break;
  }

  if (!newItem?.id) return;

  currAddedItems.push(newItem);
  calSum();
  render();
}

window.addRule = addRule;
window.increase = increase;
window.addOffense = addOffense;
window.copyToClipboard = copyToClipboard;
window.getName = getName;
window.getCccd = getCccd;

// render logic

data.forEach((type, index) => {
  let content = "";
  type.forEach((item) => {
    content += `
            <tr>
                <td>${item.name}</td>
                <td>
                    <div class="number-checkbox">
                        ${
                          item?.changeable
                            ? `<input
                              type="number"
                              value="${item.quantity}"
                              min="1"
                              style="width: 48px; height: 32px"
                              onchange="increase('${item.id}', this.value)"
                            />`
                            : ""
                        }
                        <input type="checkbox" onclick="addOffense('${
                          item.id
                        }')"/>
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
