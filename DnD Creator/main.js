document.querySelector('select').addEventListener('click', getInfo)
document.querySelector('#attribute2').addEventListener('click', getDesc)
const attributesList = {
    "Ability Scores": null,
    "Alignments": null,
    "Classes": null,
    "Conditions": null,
    "Damage Types": null,
    "Equipment": null,
    "Equipment Categories": null,
    "Features": null,
    "Languages": null,
    "Magic Items": null,
    "Magic Schools": null,
    "Monsters": null,
    "Proficiencies": null,
    "Races": null,
    "Rule Sections": null,
    "Rules": null,
    "Skills": null,
    "Spells": null,
    "Subclasses": null,
    "Subraces": null,
    "Traits": null,
    "Weapon Properties": null,
}
attributesList["Alignments"]=function(data){
    return data.desc
}
attributesList["Classes"]=function(data){
    let potato = document.createElement('ul')
    data.proficiencies.forEach(prof => {
        let chips = document.createElement('li')
        chips.innerText = prof.name
        potato.appendChild(chips)
    })
    return potato
}
const attributes = document.querySelector('#attributes')
Object.keys(attributesList).forEach(el => {
    const opt = document.createElement('option')
    opt.value = el.toLowerCase().replace(/ /g, "-" )
    opt.innerText = el
    attributes.appendChild(opt)
})
const attTwo = document.querySelector('#attribute2')

function getInfo(){
    let character = attributes.value
    let url = `https://www.dnd5eapi.co/api/${character}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            while(attTwo.firstChild){
                attTwo.firstChild.remove()
            }
            data.results.forEach(obj => {
                const options = document.createElement('option')
                options.value = obj.index
                options.innerHTML= obj.name
                attTwo.appendChild(options)
            })
            getDesc()
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}    
function getDesc(){
    let character = attributes.value
    let char = attTwo.value
    let url = `https://www.dnd5eapi.co/api/${character}/${char}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let option = document.querySelector(`[value="${character}"]`)
            let charVar = option.innerHTML
            let renderFunction = attributesList[charVar]
            let text = renderFunction ? renderFunction(data) : ""
            if(typeof text === "string"){
                document.getElementById('rest').innerHTML = text
            }else {
                document.getElementById('rest').innerHTML = ""
                document.getElementById('rest').appendChild(text)
            }
            
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}