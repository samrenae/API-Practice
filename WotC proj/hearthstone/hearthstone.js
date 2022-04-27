let searchParam = document.getElementById('searchParam')
const selectedItemData = document.querySelector("#selectItemData");
const unList = document.querySelector("ul");
const cardImg = document.getElementById('cardImg')
searchParam.addEventListener('keypress', function(e){
    if(e.key === "Enter")
    return getInfo()
})
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'omgvamp-hearthstone-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '89095de3a7msh7f4558b3f62fe38p146712jsn03478638eba7'
    }
};

function getInfo(){
    fetch(`https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/search/${searchParam.value}`, options)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            selectedItemData.innerText = "";
            return displayItem(data)
        })
}

function displayItem(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (key === "cardId" || 
      key === 'dbfId' || 
      key === "locale" ) return;
      recurObj(key, value);
    });
  
    return void 0;
  }
  
  
  
  function recurObj(k, v) {
    if(k === 'img'){
        recurStr(k, v)
    }
    if (k === "cardId" || 
      k === 'dbfId' || 
      k === "locale" ) return;
    if (v === false){
        v = v.toString().replace(/false/g, "No")
    }else if (v === true){
        v = v.toString().replace(/true/g, "Yes")
    }
    if (typeof v === "string") {
      return recurStr(k, v);
    } else if (typeof v === "object" || Array.isArray(v)) {
      if (isNaN(k) && k !== "data") {
        let listEl = document.createElement("p");
        listEl.textContent = `${
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
        (k[0].toUpperCase() + k.substring(1)).replace(/_/g, " ")
      }: ${v}`;
      selectedItemData.appendChild(unList.appendChild(listEl));
      return;
    }
    return;
  }
  
  function recurStr(key, value) {
    if(key === 'img'){
        let cardImg = document.createElement('img')
        cardImg.setAttribute('class', '')
        cardImg.src = value
        selectedItemData.appendChild(cardImg)
        return
    }
    if (key === "name"){
        let listEl = document.createElement("p");
        listEl.textContent = `${
            (key[0].toUpperCase() + key.substring(1)).replace(/_/g, " ")
         }: ${(value.replace(/_/g, " "))}`;
        selectedItemData.appendChild(listEl);
        return
    }
    if (
        key === "text"
      ) {
        console.log(value)
        let converter = new showdown.Converter({ tables: "true" });
        const html = converter.makeHtml(value);
        selectedItemData.innerHTML += html;
        return;
      }
    if (key === "cardId" || 
      key === 'dbfId' || 
      key === "locale" ) return;
    if (value === false){
        value.replace(/false/g, "No")
    } else if (value === true){
        value = value.toString().replace(/true/g, "Yes")
    }
    if (isNaN(key)) {
      let listEl = document.createElement("li");
      listEl.textContent = `${
        (key[0].toUpperCase() + key.substring(1)).replace(/_/g, " ")
      }: ${(value.replace(/_/g, " "))}`;
      selectedItemData.appendChild(unList.appendChild(listEl));
    } else if (typeof key === "number") {
      return;
    } else {
      let listEl = document.createElement("p");
      listEl.textContent = `${(value.replace(/_/g, " "))}`;
      selectedItemData.appendChild(listEl);
    }
    return;
  }