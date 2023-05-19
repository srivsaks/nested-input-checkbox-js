import "./styles.css";
const parent = document.querySelector("ul");

const data = [
  {
    id: 1,
    checked: false,
    parentId: null,
    children: [
      {
        id: 5,
        checked: false,
        children: [
          {
            id: 7,
            checked: false,
            children: [
              {
                id: 10,
                checked: false,
                children: [],
                parentId: 7
              }
            ],
            parentId: 5
          },
          {
            id: 8,
            checked: false,
            children: [],
            parentId: 5
          },
          {
            id: 9,
            checked: false,
            children: [],
            parentId: 5
          }
        ],
        parentId: 1
      },
      {
        id: 6,
        checked: false,
        children: [],
        parentId: 1
      }
    ]
  },
  {
    id: 2,
    checked: false,
    children: [],
    parentId: null
  },
  {
    id: 3,
    checked: false,
    children: [
      {
        id: 11,
        checked: false,
        children: [],
        parentId: 3
      },
      {
        id: 12,
        checked: false,
        children: [],
        parentId: 3
      }
    ],
    parentId: null
  },
  {
    id: 4,
    checked: false,
    children: [],
    parentId: null
  }
];

function recur(inputs) {
  if (inputs.length === 0) return "";
  else {
    let res = `
    <ul>
    `;

    for (let i = 0; i < inputs.length; i++) {
      let html = `
      <li>
      <input type="checkbox" data-child="${inputs[i].children}" data-id="${inputs[i].id}" data-parent="${inputs[i].parentId}"></input>
      `;
      if (inputs[i].children.length > 0) {
        const recurData = recur(inputs[i].children);
        html += recurData;
      } else {
      }
      html =
        html +
        `
        </li>
        `;
      res += html;
    }
    res += `
    </ul>
    `;
    return res;
  }
}

function createBoxes(data, parent, level = 0) {
  for (let i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    /*const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = data[i].checked;
    input.setAttribute("data-child", data[i].children);*/

    const nestedChildren = recur(data[i].children);
    // console.log(nestedChildren);
    if (nestedChildren) {
      const children = JSON.stringify(data[i].children);
      // console.log(children);
      li.innerHTML = `
      <input type="checkbox" data-child="${children}" data-id="${data[i].id}" data-parent="${data[i].parentId}"></input>
      ${nestedChildren}
      `;
    } else
      li.innerHTML = `
    <input type="checkbox" data-id="${data[i].id}" data-child="${data[i].children}" data-parent="${data[i].parentId}"></input>
    `;
    parent.appendChild(li);
    //console.log(parent);
  }
  /*console.log(
    parent.children[0].children[0].getAttribute("data-child"),
    parent.children[0].children[0]
  );*/
}

createBoxes(data, parent);

const inputs = document.querySelectorAll("input");
//console.log(inputs.length);

function updateChildren(inputs, value) {
  const arrayInputs = Array.from(inputs);
  arrayInputs.forEach((input) => {
    const node = input.children[0];
    node.checked = value;
    if (input.children[1]) {
      //console.log(input.children[1].children);
      updateChildren(input.children[1].children, value);
    }
  });
  //console.log(inputs.length);
}

function updateParents(input, value) {
  // check if all its siblings have same values if yes then update parent else no
  const ulParent = input.closest("ul");
  const liSiblings = Array.from(ulParent.children);
  // console.log("hey");

  if (liSiblings.length === 1) {
    // console.log(ulParent, input.closest("input"));
    const inputParent = ulParent.closest("li").children[0];
    inputParent.checked = value;
    // console.log(ulParent, inputParent);
    console.log("singleChild");
    updateParents(inputParent, value);
  } else {
    if (!ulParent.closest("li")) {
      console.log("hey");
      return;
    }
    const inputParent = ulParent.closest("li").children[0];
    const siblings = liSiblings.filter((sibling) => {
      const curr = sibling.children[0];
      return input.checked === curr.checked;
    });
    if (input.checked) {
      if (siblings.length < liSiblings.length) {
        return;
      } else {
        console.log("all same");
        inputParent.checked = value;
        updateParents(inputParent, value);
      }
    } else {
      console.log("unchecked");
      inputParent.checked = value;
      updateParents(inputParent, value);
    }
  }
}

inputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    const parent = e.target.closest("ul");
    const parentId = e.target.getAttribute("data-parent");
    //console.log(parentId);

    const siblings = parent.children;
    const value = e.target.checked;
    //console.log(siblings.length);
    let myChildren = [];
    const curr = Array.from(siblings).filter((sibling) => {
      return (
        sibling.children[0].getAttribute("data-id") ===
        e.target.getAttribute("data-id")
      );
    });
    // for children
    if (curr[0].children[1]) {
      myChildren = curr[0].children[1].children;
      updateChildren(myChildren, value);
      // console.log(curr[0].children[1].children);
    }
    if (parentId === "null") {
      console.log("1st level");
      return;
    }
    updateParents(e.target, value);
  });
});
