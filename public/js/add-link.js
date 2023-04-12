let c = 1
const inputLink = document.getElementById('input-link-1')
const addInputButton = document.getElementById('add-input-button')
const submitButton = document.getElementById('submit-button')
const form = document.querySelector('form')

addInputButton.addEventListener('click', () => {
  const newInputLink = inputLink.cloneNode(true)
  newInputLink.querySelector('input').value = ""
  form.insertBefore(newInputLink, submitButton)
})
