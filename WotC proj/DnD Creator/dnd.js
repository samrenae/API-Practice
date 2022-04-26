window.onload = urlData;
document.querySelector("#queryOne").addEventListener("click", () => getInfo());
document.querySelector("#queryTwo").addEventListener("change", queryTwoActions);
const queryOne = document.querySelector("#queryOne");
const queryTwo = document.querySelector("#queryTwo");
const queryThree = document.querySelector("#queryThree");
queryThree.addEventListener("change", queryThreeActions);

const selectedItemData = document.querySelector("#selectItemData");
const unList = document.querySelector("ul");

let equipmentUrlMappings = {};
const keyNameMap = {
  desc: "Description",
};
let urls = ["https://www.dnd5eapi.co/api", "https://api.open5e.com/"];

const urlCats = {
  "https://www.dnd5eapi.co/api": [
    "rules",
    "rule-sections",
    "ability-scores",
    "alignments",
    "conditions",
    "damage-types",
    "equipment",
    "equipment-categories",
    "feats",
    "features",
    "languages",
    "magic-schools",
    "proficiencies",
    "skills",
    "subclasses",
    "subraces",
    "traits",
    "weapon-properties",
  ],
  "https://api.open5e.com/": [
    "spells",
    "planes",
    "monsters",
    "classes",
    "races",
    "spells",
    "sections",
    "backgrounds",
    "classes",
    "magicitems",
  ],
};

function urlData() {
  urls.forEach((url) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        Object.keys(data).forEach((el) => {
          if (el === "levels") {
            return;
          }
          if (urlCats[url].indexOf(el) === -1) {
            return;
          }
          const opt = document.createElement("option");
          opt.value = el;
          opt.innerHTML = el.toUpperCase().replace(/-/g, " ");
          queryOne.appendChild(opt);
        });
      })
      .catch((err) => {
        console.log(`error ${err}`);
      });
      
  });
}

function getInfo(pageUrl) {
  console.log(pageUrl)
  let queryOneSelect = queryOne.value;
  let url = "";
  if (urlCats[urls[0]].includes(queryOneSelect)) {
    url = `https://www.dnd5eapi.co/api/${queryOneSelect}`;
  } else {
    url = `https://api.open5e.com/${queryOneSelect}`;
  }
  if (pageUrl){
    url = pageUrl
  }
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if(!pageUrl){
        while (queryTwo.firstChild) {
          queryTwo.firstChild.remove();
        }
      }
      if (data.next) {
        getInfo(data.next)
      }
      data.results.forEach((obj) => {
        const options = document.createElement("option");
        if (obj.index) {
          options.value = obj.index;
        } else if (obj.slug) {
          options.value = obj.slug;
        }
        options.innerHTML = obj.name;
        queryTwo.appendChild(options);
      });
      queryTwo.setAttribute("class", "");
      return queryTwoActions();
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

function queryTwoActions() {
  let queryOneSelect = queryOne.value;
  let queryTwoSelect = queryTwo.value;
  let url = "";
  if (urlCats[urls[0]].indexOf(queryOneSelect) != -1) {
    url = `https://www.dnd5eapi.co/api/${queryOneSelect}/${queryTwoSelect}`;
  } else {
    url = `https://api.open5e.com/${queryOneSelect}/${queryTwoSelect}`;
  }
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      queryThree.setAttribute("class", "hidden");
      selectedItemData.innerText = "";
      if (queryOneSelect === "equipment-categories") {
        while (queryThree.firstChild) {
          queryThree.firstChild.remove();
        }
        data.equipment.forEach((obj) => {
          const options = document.createElement("option");
          options.value = obj.index;
          options.innerHTML = obj.name;
          queryThree.appendChild(options);
          equipmentUrlMappings[obj.index] = obj.url;
        });
        queryThreeActions();
        queryThree.setAttribute("class", "");
      } else if (
        queryOneSelect === "rule-sections" ||
        queryOneSelect === "rules"
      ) {
        let converter = new showdown.Converter({ tables: "true" });
        const html = converter.makeHtml(data.desc);
        selectedItemData.innerHTML = html;
        return displayItem(data);
      }else {
        queryThree.setAttribute("class", "hidden");
        displayItem(data);
        return;
      }
      return void 0;
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

function queryThreeActions() {
  let url = `https://www.dnd5eapi.co${equipmentUrlMappings[queryThree.value]}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      selectedItemData.innerText = "";
      return displayItem(data);
    });
}

function displayItem(data) {
  Object.entries(data).forEach(([key, value]) => {
    if (key === "index") return;
    if (key === "url") return;
    recurObj(key, value);
  });

  return void 0;
}



function recurObj(k, v) {
  let queryOneSelect = queryOne.value;
  let queryTwoSelect = queryTwo.value;
  if (
    k === "index" ||
    k === "url" ||
    k.includes("url") ||
    k.includes("document") ||
    k.includes("slug") ||
    k.includes("page") ||
    v === null ||
    v === "" ||
    Array.isArray(v) && !v.length
  ) {
    return;
  }
  if (
    (queryOneSelect === "classes" && typeof v === "string") ||
    (queryOneSelect === "races" && typeof v === "string") ||
    (queryOneSelect === "sections" && typeof v === "string") ||
    (queryOneSelect === "backgrounds" && typeof value === "string")
  ) {
    let converter = new showdown.Converter({ tables: "true" });
    const html = converter.makeHtml(v);
    selectedItemData.innerHTML += html
  } else if (typeof v === "string") {
    return recurStr(k, v);
  } else if (typeof v === "object" || Array.isArray(v)) {
    if (isNaN(k)) {
      let listEl = document.createElement("p");
      listEl.textContent = `${
        keyNameMap[k] ||
        (k[0].toUpperCase() + k.substring(1)).replace(/_/g, " ")
      }:`;
      selectedItemData.appendChild(listEl);
    }
    Object.entries(v).forEach(([key, value]) => {
      return recurObj(key, value);
    });
  } else {
    let listEl = document.createElement("li");
    listEl.textContent = `${
      keyNameMap[k] || (k[0].toUpperCase() + k.substring(1)).replace(/_/g, " ")
    }: ${v}`;
    selectedItemData.appendChild(unList.appendChild(listEl));
    return;
  }
  return;
}

function recurStr(key, value) {
  let queryOneSelect = queryOne.value;
  let queryTwoSelect = queryTwo.value;
  if (
    key === "index" ||
    key === "url" ||
    key.includes("url") ||
    key.includes("document") ||
    key.includes("slug") ||
    key.includes("page") ||
    value === null ||
    value === "" ||
    Array.isArray(value) && !value.length
  ) {
    return;
  }
  if (
    (queryOneSelect === "classes" && typeof v === "string") ||
    (queryOneSelect === "races" && typeof v === "string") ||
    (queryOneSelect === "sections" && typeof v === "string") ||
    (queryOneSelect === "backgrounds" && typeof value === "string")
  ) {
    let converter = new showdown.Converter({ tables: "true" });
    const html = converter.makeHtml(value);
    selectedItemData.innerHTML += html
    return
  } else if (isNaN(key)) {
    let listEl = document.createElement("li");
    listEl.textContent = `${
      keyNameMap[key] ||
      (key[0].toUpperCase() + key.substring(1)).replace(/_/g, " ")
    }: ${value}`;
    selectedItemData.appendChild(unList.appendChild(listEl));
  } else if (typeof key === "number") {
    return;
  } else {
    let listEl = document.createElement("p");
    listEl.textContent = `${value}`;
    selectedItemData.appendChild(listEl);
  }
  return;
}
