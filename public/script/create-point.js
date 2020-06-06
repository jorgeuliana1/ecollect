function populateStates() {
    const stateSelect = document.querySelector("select[name=state-id]")
    const dataURL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"

    fetch(dataURL)
        .then( res => res.json() )
        .then( states => {
            for(state of states) {
                stateSelect.innerHTML += `<option value="${state.id}"> ${state.nome} </option>`
            }
        })
}

function getCities(event) {

    const citySelect = document.querySelector("[name=city]")
    const stateID = event.target.value

    const stateInput = document.querySelector("[name=state]")
    const indexOfSelectedState = event.target.selectedIndex

    const stateName = event.target.options[indexOfSelectedState].innerHTML
    stateInput.value = stateName.trim()
    
    const citiesURL = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateID}/municipios`

    citySelect.innerHTML = "<option value>Select your city</option>"
    citySelect.disabled = true

    fetch(citiesURL)
        .then( res => res.json() )
        .then( cities => {

            for(city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}"> ${city.nome} </option>`
            }

            citySelect.disabled = false
        })
}

function handleSelectedItem(event) {

    // Add or remove a class with JS
    const itemLi = event.target

    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    const alreadySelected = selectedItems.findIndex( item => {
        return item == itemId
    })

    if(alreadySelected >= 0) {
        const filteredItems = selectedItems.filter( item => {
            return item != itemId
        })

        selectedItems = filteredItems
    } else {
        selectedItems.push(itemId)
    }

    collectedItems.value = selectedItems

    
}

populateStates()
document
    .querySelector("select[name=state-id]")
    .addEventListener("change", getCities)

// Collection items:
let selectedItems = []
const collectedItems = document.querySelector("input[name=items]")
const itemsToCollect = document.querySelectorAll(".items-grid li")
for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}