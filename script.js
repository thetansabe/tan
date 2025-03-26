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

  const specialSumItems = currAddedItems.filter(
    (item) => item.id == "37" || item.id === "35"
  );

  currAddedItems.forEach((item) => {
    offenses.push(item);
    if (
      item.id !== "37" &&
      item.id !== "35" &&
      charges + item.point * item.quantity <= 500
    ) {
      charges += item.point * item.quantity;
    } else if (charges + item.point * item.quantity > 500) {
      charges = 500;
    }
  });

  specialSumItems.forEach((item) => {
    charges += item.point * item.quantity;
  });
}

function printOffense() {
  return offenses
    .map((item) => {
      if (item.name === "Sử dụng vũ khí nóng nơi công cộng") {
        return "Sử dụng vũ khí nóng nơi công cộng+Tàng trữ vũ khí nóng trái phép+Sử dụng vũ khí nóng trái phép";
      }
      if (item.changeable) {
        return item.name + `(x${item.quantity})`;
      }
      return item.name;
    })
    .join(" + ");
}

function render() {
  // update UI
  document.querySelector("#charges").innerHTML = charges;
  document.querySelector("#offenses").innerHTML = printOffense();
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

function copyToClipboard(text) {
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

function copyCharges() {
  copyToClipboard(charges);
}

function copyOffenses() {
  const textOffense = printOffense();
  const all =
    "Tên: " +
    name +
    "\n" +
    "CCCD: " +
    id +
    "\n" +
    "Tội danh: " +
    textOffense +
    "\n" +
    "Mức án: " +
    charges +
    "\n" +
    "Đã xử lý";
  copyToClipboard(all);
}

let militaryState = false;

function addRule(rule) {
  const item = currAddedItems.find((item) => item.id === rule);
  console.log("mil", militaryState);
  if (item) {
    currAddedItems = currAddedItems.filter((item) => item.id !== rule);
    calSum();
    render();
    return;
  }

  let newItem = {};
  switch (rule) {
    case "military":
      console.log("mil after click", militaryState);
      const specialItem = currAddedItems.find((item) => item.id === "16");
      const militaryBox = document.querySelector("#military");
      militaryState = militaryBox.checked;
      if (!specialItem) {
        militaryBox.checked = false;
        militaryState = false;
        return;
      }
      let updatedItem16 = {};
      if (militaryState) {
        updatedItem16 = {
          ...specialItem,
          name: "Sử dụng vũ khí nóng nơi công cộng(Có giấy NVQS)",
          point: 30,
        };
        currAddedItems = currAddedItems.map((item) =>
          item.id === "16" ? updatedItem16 : item
        );
      } else {
        updatedItem16 = {
          ...specialItem,
          name: "Sử dụng vũ khí nóng nơi công cộng",
          point: 90,
        };
        currAddedItems = currAddedItems.map((item) =>
          item.id === "16" ? updatedItem16 : item
        );
      }

      calSum();
      render();
      return;
    case "weapons":
      newItem = {
        id: "weapons",
        name: "Tàng trữ vũ khí nóng trái phép",
        quantity: 1,
        isSelected: true,
        point: 30,
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
window.copyCharges = copyCharges;
window.copyOffenses = copyOffenses;
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
