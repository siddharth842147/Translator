// 100+ Languages matching translation_app.py
const LANGUAGES = {
  auto: "Auto Detect",
  af: "Afrikaans",
  sq: "Albanian",
  am: "Amharic",
  ar: "Arabic",
  hy: "Armenian",
  az: "Azerbaijani",
  eu: "Basque",
  be: "Belarusian",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  ceb: "Cebuano",
  ny: "Chichewa",
  "zh-cn": "Chinese (Simplified)",
  "zh-tw": "Chinese (Traditional)",
  co: "Corsican",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  eo: "Esperanto",
  et: "Estonian",
  tl: "Filipino",
  fi: "Finnish",
  fr: "French",
  fy: "Frisian",
  gl: "Galician",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  ht: "Haitian Creole",
  ha: "Hausa",
  haw: "Hawaiian",
  he: "Hebrew",
  hi: "Hindi",
  hmn: "Hmong",
  hu: "Hungarian",
  is: "Icelandic",
  ig: "Igbo",
  id: "Indonesian",
  ga: "Irish",
  it: "Italian",
  ja: "Japanese",
  jw: "Javanese",
  kn: "Kannada",
  kk: "Kazakh",
  km: "Khmer",
  ko: "Korean",
  ku: "Kurdish (Kurmanji)",
  ky: "Kyrgyz",
  lo: "Lao",
  la: "Latin",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mg: "Malagasy",
  ms: "Malay",
  ml: "Malayalam",
  mt: "Maltese",
  mi: "Maori",
  mr: "Marathi",
  mn: "Mongolian",
  my: "Myanmar (Burmese)",
  ne: "Nepali",
  no: "Norwegian",
  or: "Odia (Oriya)",
  ps: "Pashto",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  pa: "Punjabi",
  ro: "Romanian",
  ru: "Russian",
  sm: "Samoan",
  gd: "Scots Gaelic",
  sr: "Serbian",
  st: "Sesotho",
  sn: "Shona",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  es: "Spanish",
  su: "Sundanese",
  sw: "Swahili",
  sv: "Swedish",
  tg: "Tajik",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  ug: "Uyghur",
  uz: "Uzbek",
  vi: "Vietnamese",
  cy: "Welsh",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  zu: "Zulu"
};

// DOM Elements
const sourceLangSelect = document.getElementById("sourceLang");
const targetLangSelect = document.getElementById("targetLang");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const charCount = document.getElementById("charCount");
const detectedLangBadge = document.getElementById("detectedLangBadge");
const translationState = document.getElementById("translationState");
const speechInputBtn = document.getElementById("speechInputBtn");
const speechBtnText = document.getElementById("speechBtnText");
const speechStatus = document.getElementById("speechStatus");
const clearInputBtn = document.getElementById("clearInputBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const swapLangsBtn = document.getElementById("swapLangsBtn");
const translateBtn = document.getElementById("translateBtn");
const playAudioBtn = document.getElementById("playAudioBtn");
const playBtnText = document.getElementById("playBtnText");
const copyBtn = document.getElementById("copyBtn");
const copyBtnText = document.getElementById("copyBtnText");
const toastMessage = document.getElementById("toastMessage");

// Populate Language Dropdowns
function initLanguages() {
  // Source languages (includes auto detect)
  for (const [code, name] of Object.entries(LANGUAGES)) {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = name;
    if (code === "auto") opt.selected = true;
    sourceLangSelect.appendChild(opt);
  }

  // Target languages (excludes auto detect)
  for (const [code, name] of Object.entries(LANGUAGES)) {
    if (code === "auto") continue;
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = name;
    if (code === "en") opt.selected = true;
    targetLangSelect.appendChild(opt);
  }
}

// Update Character Count
inputText.addEventListener("input", () => {
  const count = inputText.value.length;
  charCount.textContent = `${count} character${count === 1 ? "" : "s"}`;
});

// Toast notification helper
let toastTimeout;
function showToast(message, isError = false) {
  clearTimeout(toastTimeout);
  toastMessage.textContent = message;
  toastMessage.style.display = "block";
  toastMessage.style.background = isError ? "#fee2e2" : "#ecfdf5";
  toastMessage.style.color = isError ? "#b91c1c" : "#065f46";
  toastMessage.style.borderColor = isError ? "#fca5a5" : "#a7f3d0";
  toastTimeout = setTimeout(() => {
    toastMessage.style.display = "none";
  }, 4000);
}

// Speech Recognition (Browser Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    speechBtnText.textContent = "Listening... Speak now";
    speechInputBtn.classList.add("btn-listening");
    speechStatus.textContent = "🎤 Listening for your voice...";
    speechStatus.style.display = "block";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (inputText.value.trim()) {
      inputText.value += " " + transcript;
    } else {
      inputText.value = transcript;
    }
    inputText.dispatchEvent(new Event("input"));
    speechStatus.textContent = `Captured: "${transcript}"`;
  };

  recognition.onerror = (event) => {
    speechStatus.textContent = `⚠ Speech recognition error: ${event.error}`;
  };

  recognition.onend = () => {
    isListening = false;
    speechBtnText.textContent = "Speech Input";
    speechInputBtn.classList.remove("btn-listening");
    setTimeout(() => {
      speechStatus.style.display = "none";
    }, 4000);
  };
}

speechInputBtn.addEventListener("click", () => {
  if (!recognition) {
    alert("Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
    return;
  }

  if (isListening) {
    recognition.stop();
  } else {
    const lang = sourceLangSelect.value;
    recognition.lang = lang !== "auto" ? lang : navigator.language || "en-US";
    try {
      recognition.start();
    } catch (err) {
      console.warn("Recognition start error:", err);
    }
  }
});

// Translation Logic
async function handleTranslation() {
  const text = inputText.value.trim();
  if (!text) {
    showToast("Please enter or speak text to translate.", true);
    return;
  }

  const sourceLang = sourceLangSelect.value;
  const targetLang = targetLangSelect.value;

  translateBtn.disabled = true;
  translateBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Translating...</span>';
  translationState.textContent = "Translating...";

  try {
    let resultText = "";
    let detectedSource = null;

    // 1. Try Netlify Serverless Function
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });

      if (response.ok) {
        const data = await response.json();
        resultText = data.translation;
        detectedSource = data.detectedSource;
      } else {
        throw new Error(`Netlify function returned status ${response.status}`);
      }
    } catch (funcError) {
      console.warn("Netlify function unavailable, attempting direct fallback:", funcError);
      // 2. Direct client-side fallback
      const directUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
        sourceLang
      )}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(directUrl);
      const data = await res.json();
      if (Array.isArray(data[0])) {
        resultText = data[0].map((s) => (s && s[0] ? s[0] : "")).join("");
      }
      detectedSource = data[2];
    }

    if (resultText) {
      outputText.value = resultText;
      playAudioBtn.disabled = false;
      copyBtn.disabled = false;
      translationState.textContent = "Translation complete ✓";

      if (sourceLang === "auto" && detectedSource && LANGUAGES[detectedSource]) {
        detectedLangBadge.textContent = `Detected: ${LANGUAGES[detectedSource]}`;
        detectedLangBadge.style.display = "inline-block";
      } else {
        detectedLangBadge.style.display = "none";
      }
    } else {
      throw new Error("Empty translation result received.");
    }
  } catch (err) {
    console.error("Translation error:", err);
    showToast(`Translation error: ${err.message}`, true);
    translationState.textContent = "Translation failed";
  } finally {
    translateBtn.disabled = false;
    translateBtn.innerHTML = '<span class="btn-icon">🔄</span><span>Translate</span>';
  }
}

translateBtn.addEventListener("click", handleTranslation);

// Text-to-Speech (Web Speech Synthesis)
playAudioBtn.addEventListener("click", () => {
  const text = outputText.value.trim();
  if (!text) return;

  if (!("speechSynthesis" in window)) {
    showToast("Text-to-speech is not supported by your browser.", true);
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    playBtnText.textContent = "Play Translation";
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const targetCode = targetLangSelect.value;
  utterance.lang = targetCode;

  utterance.onstart = () => {
    playBtnText.textContent = "Playing...";
  };

  utterance.onend = () => {
    playBtnText.textContent = "Play Translation";
  };

  utterance.onerror = (e) => {
    playBtnText.textContent = "Play Translation";
    console.warn("Speech synthesis error:", e);
  };

  window.speechSynthesis.speak(utterance);
});

// Copy to Clipboard
copyBtn.addEventListener("click", async () => {
  const text = outputText.value.trim();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtnText.textContent = "Copied! ✓";
    showToast("Translation copied to clipboard!");
    setTimeout(() => {
      copyBtnText.textContent = "Copy";
    }, 2000);
  } catch (err) {
    showToast("Failed to copy to clipboard.", true);
  }
});

// Swap Languages
swapLangsBtn.addEventListener("click", () => {
  const currentSource = sourceLangSelect.value;
  const currentTarget = targetLangSelect.value;

  if (currentSource === "auto") {
    showToast("Cannot swap when source language is Auto Detect.", true);
    return;
  }

  sourceLangSelect.value = currentTarget;
  targetLangSelect.value = currentSource;

  // Also swap text if both exist
  const inVal = inputText.value;
  const outVal = outputText.value;
  if (outVal) {
    inputText.value = outVal;
    outputText.value = inVal;
    inputText.dispatchEvent(new Event("input"));
  }
});

// Clear Buttons
clearInputBtn.addEventListener("click", () => {
  inputText.value = "";
  inputText.dispatchEvent(new Event("input"));
  detectedLangBadge.style.display = "none";
});

clearAllBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  inputText.dispatchEvent(new Event("input"));
  detectedLangBadge.style.display = "none";
  playAudioBtn.disabled = true;
  copyBtn.disabled = true;
  translationState.textContent = "Ready to translate";
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
});

// Initialize on Load
initLanguages();

