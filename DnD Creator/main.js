document.querySelector('select').addEventListener('blur', getInfo)
document.querySelector('#attribute2').addEventListener('click', getDesc)
const attributes = [
    "Ability Scores",
    "Alignments",
    "Classes",
    "Conditions",
    "Damage Types",
    "Equipment",
    "Equipment Categories",
    "Features",
    "Languages",
    "Magic Items",
    "Magic Schools",
    "Monsters",
    "Proficiencies",
    "Races",
    "Rule Sections",
    "Rules",
    "Skills",
    "Spells",
    "Subclasses",
    "Subraces",
    "Traits",
    "Weapon Properties"
]

function getInfo(){
    let character = document.getElementById('attributes').value
    let url = `https://www.dnd5eapi.co/api/${character}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            while(document.getElementById('attribute2').firstChild){
                document.getElementById('attribute2').firstChild.remove()
            }
            data.results.forEach(obj => {
                const options = document.createElement('option')
                options.value = obj.index
                options.innerHTML= obj.name
                document.getElementById('attribute2').appendChild(options)
            })
            getDesc()
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}    
function getDesc(){
    let character = document.getElementById('attributes').value
    let char = document.getElementById('attribute2').value
    let url = `https://www.dnd5eapi.co/api/${character}/${char}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            document.getElementById('rest').innerText = data.desc
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}