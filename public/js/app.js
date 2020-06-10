console.log('Client side script is running!')

const banks = [
    "ACCESS BANK PLC", "CITIBANK PLC", "ECOBANK PLC", "FIDELITY BANK PLC", "FIRST BANK OF NIGERIA PLC", "FIRST CITY MONUMENT BANK PLC", "GLOBUS BANK PLC", "GUARANTY TRUST BANK PLC", "HERITAGE BANK PLC", "KEYSTONE BANK PLC", "POLARIS BANK PLC", "PROVIDUS BANK PLC", "SUN TRUST BANK NIGERIA LTD", "STANBIC IBTC BANK PLC", "STANDARD CHARTERED BANK PLC", "STERLING BANK PLC", "TITAN TRUST BANK NIGERIA LTD", "UNION BANK OF NIGERIA PLC", "UNITED BANK FOR AFRICA PLC", "UNITY BANK PLC", "WEMA BANK PLC", "ZENITH BANK PLC"
]

const states = [
    "ABIA", "ADAMAWA", "AKWA IBOM", "ANAMBRA", "BAUCHI", "BAYELSA", "BENUE", "BORNO", "CROSS RIVER", "DELTA", "EBONYI", "EDO", "EKITI", "ENUGU", "FCT ABUJA", "GOMBE", "IMO", "JIGAWA", "KADUNA", "KANO", "KATSINA", "KEBBI", "KOGI", "KWARA", "LAGOS", "NASSARAWA", "NIGER", "OGUN", "ONDO", "OSUN", "OYO", "PLATEAU", "RIVERS", "SOKOTO", "TARABA", "YOBE", "ZAMFARA"
]

// Generate bank-select DOM
const bankSelectElement = document.querySelector('#bank-select')
const bankSelectFragment = document.createDocumentFragment()

banks.forEach((bank, index) => {
    const optionElement = document.createElement('option')
    optionElement.textContent = bank
    optionElement.value = bank
    bankSelectFragment.appendChild(optionElement)
})

bankSelectElement.appendChild(bankSelectFragment)

// Generate state-select DOM
const stateSelectElement = document.querySelector('#state-select')
const stateFragment = document.createDocumentFragment()

states.forEach((state, index) => {
    const optionElement = document.createElement('option')
    optionElement.textContent = state
    optionElement.value = state
    stateFragment.appendChild(optionElement)
})

stateSelectElement.appendChild(stateFragment)


// Set up eventlistener for toggling select view
bankSelectElement.addEventListener('change', (e) => { 
    const toggleStateElement = document.querySelector('#toggle-state-select')
    if (bankSelectElement.innerHTML !== "") {
        toggleStateElement.style.display = 'block'
    } else {
        toggleStateElement.style.display = 'none'
    }
})


// Set up eventlisteners for rendering bank list
let bankValue
let stateValue

bankSelectElement.addEventListener('change', (e) => {
    bankValue = e.target.value
})

stateSelectElement.addEventListener('change', (e) => {
    stateValue = e.target.value
})

const findButtonElement = document.querySelector('#find')
const bankDivElement = document.querySelector('#bank-div')
const messageElement = document.querySelector('#message')

findButtonElement.addEventListener('click', (e) => {
    e.preventDefault()
    bankDivElement.innerHTML = ''
    
    fetch(`/banks?bank=${bankValue}&state=${stateValue}`).then((response) => {
        response.json().then(({ banks, count, banksPerPage }) => {
            banks.forEach((branch) => {
                const bankListElement = document.createElement('ul')
                const branchNameElement = document.createElement('li')
                const branchAddressElement = document.createElement('li')
                branchNameElement.textContent = `Branch Name: ${branch.branchname}`
                branchAddressElement.textContent = `Branch Address: ${branch.branchaddress}`
                bankListElement.appendChild(branchNameElement)
                bankListElement.appendChild(branchAddressElement)
                bankListElement.classList.add('list-item')
                bankDivElement.appendChild(bankListElement)
            })
            messageElement.textContent = `You have ${count} ${bankValue} branches in ${stateValue} State.`
        })
    })
})

const formElement = document.querySelector('#search-form')
const inputElement = document.querySelector('#form-input')

formElement.addEventListener('submit', (e) => {
    
    e.preventDefault()
    bankDivElement.innerHTML = ''
    const location = e.target.elements.searchLocation.value

    if (!location) {
        messageElement.textContent = 'Please provide a valid location'
    }
    fetch(`/banks/search?location=${location}`).then((response) => {
        
        response.json().then(({banks, count}) => {
            banks.forEach((bank) => {
                const bankListElement = document.createElement('ul')
                const bankNameElement = document.createElement('li')
                const bankStateElement = document.createElement('li')
                const branchNameElement = document.createElement('li')
                const branchAddressElement = document.createElement('li')
                bankNameElement.textContent = `Bank: ${bank.bank}`
                bankStateElement.textContent = `State: ${bank.state}`
                branchNameElement.textContent = `Branch Name: ${bank.branchname}`
                branchAddressElement.textContent = `Branch Address: ${bank.branchaddress}`
                bankListElement.appendChild(bankNameElement)
                bankListElement.appendChild(bankStateElement)
                bankListElement.appendChild(branchNameElement)
                bankListElement.appendChild(branchAddressElement)
                bankListElement.classList.add('list-item')
                bankDivElement.appendChild(bankListElement)
            })
            if (banks.length === 0) {
                messageElement.textContent = `No bank was found in ${location.toUpperCase()}.`
            } else {
                messageElement.textContent = `There are ${count} banks in ${location.toUpperCase()}.`
            }
        })
    }).catch((e)=> {
        console.log(e)
    })
    inputElement.value = ''
})