const submitButton = document.querySelector(".js-submit-button")
const sendIcon = document.querySelector(".js-send-icon")
const messageInput = document.querySelector(".js-message-input")
const translation = document.querySelector(".js-translation")
const loadingIcon = document.querySelector(".js-loading-icon")
const languageSelect = document.querySelector(".js-language-select")
const copyButton = document.querySelector(".js-copy-button")
const copyIcon = document.querySelector(".js-copy-icon")
const checkIcon = document.querySelector(".js-check-icon")
const formEl = document.querySelector(".js-form")

copyButton.disabled = translation.innerText === "" ? true : false

copyButton.addEventListener("click", () => {
  checkIcon.classList.remove("zoom-out")
  copyIcon.classList.add("zoom-out")
  checkIcon.classList.add("zoom-in")

  copyTranslation()
})
/**
 * Auto resize textarea
 */
document.querySelectorAll("textarea").forEach(function(textarea) {
  textarea.style.height = textarea.scrollHeight + "px";
  textarea.style.overflowY = "hidden";

  textarea.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
});

formEl.addEventListener("submit", event => {
  event.preventDefault()
  translation.innerText = ""
  sendIcon.classList.add("slide-to-right");
  submitButton.disabled = true
  loadingIcon.classList.add("loading");
  const data = `Please translate the following english text, "${messageInput.value}" to "${languageSelect.value[0].toUpperCase() + languageSelect.value.slice(1)}" text.`
  fetchTranslation(data)
});

async function fetchTranslation(data) {
  const messages = [
    {
      role: 'system',
      content: `You are a helpful translator. You will be asked to translate some text and will be provided from what language to the desired language. The user will provide the following as format between the {}. Please fill out the translation section of the format. EXAMPLE:
      {
        "textToTranslate": "Hi",
        "languageSelected": "Spanish",
        "translation": ""
      }`
    },
    {
      role: 'user',
      content: data
    }
  ]

  try {
      const url = 'https://openai-api-worker.tc89tk5fs2.workers.dev/'
      
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(messages)
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`Worker error: ${data.error}`)
      }
      
      renderTranslation(JSON.parse(data.content));
  } catch (err) {
    translation.innerText = "Unable to access AI. Please refresh and try again."
    sendIcon.classList.remove("slide-to-right");
    sendIcon.classList.add("slide-from-left");
    loadingIcon.classList.remove("loading");
    submitButton.disabled = false

  }
}

function renderTranslation(output) {
    sendIcon.classList.remove("slide-to-right");
    sendIcon.classList.add("slide-from-left");
    loadingIcon.classList.remove("loading");
    submitButton.disabled = false
    if (output.translation === undefined || output.translation === null || output.translation === "") {
      translation.innerText = "Uh oh, something went wrong. Please try again."
    }
    translation.innerText = output.translation
}

async function copyTranslation() {
  try {
    await navigator.clipboard.writeText(translation.innerText)
    setTimeout(() => {
      checkIcon.classList.add("zoom-out")
      checkIcon.classList.remove("zoom-in")
      copyIcon.classList.remove("zoom-out")
      copyIcon.classList.add("zoom-in")
    }, 1000)
  } catch (err) {
    console.error('Failed to copy!', err)
  }
}