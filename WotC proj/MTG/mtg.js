let searchParam = document.getElementById('searchParam')
const selectedItemData = document.querySelector("#selectItemData");
const unList = document.querySelector("ul");
const cardImg = document.getElementById('cardImg')
searchParam.addEventListener('keypress', function(e){
    if(e.key === "Enter")
    return getInfo()
})

function getInfo(){
    fetch(`https://api.scryfall.com/cards/search?q=${searchParam.value}`)
        .then((res) => res.json())
        .then((data) => {
            selectedItemData.innerText = "";
            return displayItem(data)
        })
}

function displayItem(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (key === "object" || 
      key === 'total_cards' || 
      key === "has_more" || 
      key.includes('uri') || 
      key.includes('id') ||
      key === "highres_image" ||
      key === "image_status" ||
      key.includes('set') ||
      key === 'preview' ||
      key === 'edhrec_rank') return;
      recurObj(key, value);
    });
  
    return void 0;
  }
  
  
  
  function recurObj(k, v) {
      console.log(k)
    if(k === 'image_uris'){
        recurStr(k, v)
    }
    if (
        k === "object" ||
        k === 'total_cards' || 
        k === "has_more" || 
        k.includes('uri') || 
        k.includes('id') ||
        k === "highres_image" ||
        k === "image_status" ||
        k.includes('set') ||
        k === 'preview' ||
        k === 'edhrec_rank'||
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
    if(key === 'image_uris'){
        let cardImg = document.createElement('img')
        cardImg.setAttribute('class', '')
        cardImg.src = value.normal
        selectedItemData.appendChild(cardImg)
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
        key === "object" || 
        key === 'total_cards' || 
        key === "has_more" || 
        key.includes('uri') || 
        key.includes('id') ||
        key === "highres_image" ||
        key === "image_status" ||
        key.includes('set') ||
        key === 'preview' ||
        key === 'edhrec_rank' ||
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