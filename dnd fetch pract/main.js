window.onload = pageLoad();
document.querySelector("#queryOne").addEventListener("click", getInfo);
document.querySelector("#attribute2").addEventListener("change", queryTwoActions);
const queryOne = document.querySelector("#queryOne");
const queryTwo = document.querySelector("#queryTwo");
const queryThree = document.querySelector("#queryThree");
queryThree.addEventListener("change", queryThreeActions);

const selectedItemData = document.querySelector("#selectedItemData");
let equipmentUrlMappings = {}
const keyNameMap = {
    desc: "Description",
};


const unList = document.querySelector("ul");
function pageLoad() {
  let url = "https://www.dnd5eapi.co/api";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      Object.keys(data).forEach((el) => {
        const opt = document.createElement("option");
        opt.value = el;
        opt.innerHTML = el.toUpperCase().replace(/-/g, " ");
        queryOne.appendChild(opt);
      });
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}
function getInfo() {
  let queryOne = queryOne.value;
  let url = `https://www.dnd5eapi.co/api/${queryOne}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      while (queryTwo.firstChild) {
        queryTwo.firstChild.remove();
      }
      data.results.forEach((obj) => {
        const options = document.createElement("option");
        options.value = obj.index;
        options.innerHTML = obj.name;
        queryTwo.appendChild(options);
      });
      queryTwo.setAttribute("class", "");
      return queryTwoActions()
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}
function queryTwoActions() {
  let queryOne = queryOne.value;
  let queryTwo = queryTwo.value;
  let url = `https://www.dnd5eapi.co/api/${queryOne}/${queryTwo}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      queryThree.setAttribute("class", "hidden");
      selectedItemData.innerText = "";
      if (queryOne === "equipment-categories"){
          data.equipment.forEach((obj) => {
          const options = document.createElement("option");
          options.value = obj.index;
          options.innerHTML = obj.name;
          queryThree.appendChild(options);
          equipmentUrlMappings[obj.index] = obj.url
          
        });
        queryThreeActions()
        queryThree.setAttribute("class", "");
        
      }
      else if (queryOne === "rule-sections" || queryOne === "rules") {
        let converter = new showdown.Converter({ tables: "true" });
        const html = converter.makeHtml(data.desc);
        console.log(html);
        selectedItemData.innerHTML = html;
        return;
      }
      else{
        displayItem(data);
        return;
      }
      return void 0;
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

function queryThreeActions(){
  let url = `https://www.dnd5eapi.co${equipmentUrlMappings[queryThree.value]}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      selectedItemData.innerText = "";
      return displayItem(data)
  })
  
}

function displayItem(data){
  Object.entries(data).forEach(([key, value]) => {
    if (key === "index") return;
    if (key === "url") return;
    recurObj(key, value)
  })
      
  return void 0;
}

function recurObj(k, v){
     if(k === "index" || k === "url"){
              return
            } 
      if(typeof v === "string"){
         return recurStr(k, v)
      }else if(typeof v === "object" || Array.isArray(v)){
          if(isNaN(k)){
            let listEl = document.createElement('p')
            listEl.textContent = `${keyNameMap[k] || (k[0].toUpperCase() + k.substring(1)).replace(/_/g, " ")}:`
            selectedItemData.appendChild(listEl)
          }
          Object.entries(v).forEach(([key, value]) => {
            return recurObj(key, value)
          })
      }else{
        let listEl = document.createElement("li");
        listEl.textContent = `${keyNameMap[k] || (k[0].toUpperCase() + k.substring(1)).replace(/_/g, " ")}: ${v}`;
        selectedItemData.appendChild(unList.appendChild(listEl)); 
        return;
      }
      
    
    return;
}

function recurStr(key, value){
  if(key === "index" || key === "url"){
    return
  }
  if(isNaN(key)){
    let listEl = document.createElement("li");
    listEl.textContent = `${keyNameMap[key] || (key[0].toUpperCase() + key.substring(1)).replace(/_/g, " ")}: ${value}`;
    selectedItemData.appendChild(unList.appendChild(listEl));
  }else if(typeof key === "number"){
    return
  }else{
    let listEl = document.createElement("p");
    listEl.textContent = `${value}`;
    selectedItemData.appendChild(listEl); 
  }
   return; 
}