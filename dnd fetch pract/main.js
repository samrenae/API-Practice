const attributes = document.querySelector("#attributes")
function pageLoad(){
    let url = "https://www.dnd5eapi.co/api"
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            Object.keys(data).forEach(el => {
                const opt = document.createElement('option')
                opt.value = el
                opt.innerHTML = el.toUpperCase().replace(/-/g, " ")
                attributes.appendChild(opt)
            })
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
    //let attributed = 
    //let url2 = `https://www.dnd5eapi.co/api/${attributed}`
    //fetch(url2)
    //    .then(res => res.json)
}

