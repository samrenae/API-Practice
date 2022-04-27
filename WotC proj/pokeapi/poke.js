let searchParam = document.getElementById('searchParam')
const selectedItemData = document.querySelector("#selectItemData");
const unList = document.querySelector("ul");
const cardImg = document.getElementById('cardImg')
searchParam.addEventListener('keypress', function(e){
    if(e.key === "Enter")
    return getInfo()
})

function getInfo(){
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchParam.value.toLowerCase()}/`)
        .then((res) => res.json())
        .then((data) => {
            selectedItemData.innerText = "";
            return displayItem(data)
        })
}

function displayItem(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (key === "url" || 
      key === 'location_area_encounters')
    return;
      recurObj(key, value);
    });
  
    return void 0;
  }
  
  
  
  function recurObj(k, v) {
    if(k.includes('back') ||
    k.includes('front')){
        recurStr(k, v)
    }
    if (
        k === "url" || 
        k === 'location_area_encounters'||
        v === null ||
        v === "" ||
        Array.isArray(v) && !v.length
    ) {
      return;
    }
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
    if(key.includes('back') ||
    key.includes('front')){
        let cardImg = document.createElement('img')
        cardImg.setAttribute('class', '')
        cardImg.src = value
        selectedItemData.appendChild(cardImg)
        let listEl = document.createElement('p')
        listEl.textContent = (key[0].toUpperCase() + key.substring(1)).replace(/_/g, " ")
        selectedItemData.appendChild(listEl)
        return
    }
    if (key === "name"){
        let listEl = document.createElement("p");
        listEl.textContent = `${
            (key[0].toUpperCase() + key.substring(1)).replace(/_/g, " ")
         }: ${(value.replace(/-/g, " "))}`;
        selectedItemData.appendChild(listEl);
        return
    }
    if (
        key === "url" || 
        key === 'location_area_encounters' ||
        value === null ||
        value === "" ||
        Array.isArray(value) && !value.length
    ) {
      return;
    }
    if (value === false){
        value.replace(/false/g, "No")
    }
    if (isNaN(key)) {
      let listEl = document.createElement("li");
      listEl.textContent = `${
        (key[0].toUpperCase() + key.substring(1)).replace(/_/g, " ")
      }: ${(value.replace(/-/g, " "))}`;
      selectedItemData.appendChild(unList.appendChild(listEl));
    } else if (typeof key === "number") {
      return;
    } else {
      let listEl = document.createElement("p");
      listEl.textContent = `${(value.replace(/-/g, " "))}`;
      selectedItemData.appendChild(listEl);
    }
    return;
  }