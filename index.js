const translateBtn = document.getElementById("translateBtn")
const sendIcon = document.getElementById("sendIcon")
const translateTextFrom = document.getElementById("translateTextFrom")
const translatedText = document.getElementById("translatedText")
const translatedTextLoadingIcon = document.getElementById("translatedTextLoadingIcon")
const languageSelect = document.getElementById("languageSelect")
const copyBtn = document.querySelector('sl-copy-button');
// const copyBtn = document.getElementById("copyBtn")
const formEl = document.getElementById("translate")

autosize(translateTextFrom);

// copyBtn.addEventListener("click", event => {
//   console.log("copy btn clicked.")
// })

formEl.addEventListener("submit", event => {
  translatedText.innerText = ""
  event.preventDefault()
  sendIcon.classList.add("slide-to-right");
  translateBtn.disabled = true
  translatedTextLoadingIcon.classList.add("loading");
  const data = `Please translate the following english text, "${translateTextFrom.value}" to "${languageSelect.value[0].toUpperCase() + languageSelect.value.slice(1)}" text.`
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
    translatedText.innerText = "Unable to access AI. Please refresh and try again."
    sendIcon.classList.remove("slide-to-right");
    sendIcon.classList.add("slide-from-left");
    translatedTextLoadingIcon.classList.remove("loading");
    translateBtn.disabled = false

  }
}

function renderTranslation(output) {
    sendIcon.classList.remove("slide-to-right");
    sendIcon.classList.add("slide-from-left");
    translatedTextLoadingIcon.classList.remove("loading");
    translateBtn.disabled = false
    if (output.translation === undefined || output.translation === null) {
      translatedText.innerText = "Uh oh, something went wrong. Please try again."
    }
    translatedText.innerText = output.translation
}
