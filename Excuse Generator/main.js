document.querySelector('button').addEventListener('click', getExcuse)

function getExcuse(){
    let excuses = document.querySelector('input').value.toLowerCase()
    let url = `https://excuser.herokuapp.com/v1/excuse/${excuses}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data[0].excuse)
            document.getElementById("wanted").innerText = data[0].excuse
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}
