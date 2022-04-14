document.querySelector('select').addEventListener('blur', getCharacter)

function getCharacter(){
    let character = document.querySelector('select').value
    console.log(character)
    let url = `https://www.dnd5eapi.co/api/${character}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            document.getElementById("rest").innerText=data.results[0].index
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}

    