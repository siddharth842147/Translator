# 🌍 AI Translator

AI Translator is a *Streamlit web app* that provides instant text translation with *speech-to-text* and *text-to-speech* support. Powered by deep-translator, SpeechRecognition, and gTTS, it allows users to:

* 🎤 Speak into the microphone and convert speech to text.
* 🌐 Translate text across multiple languages.
* 🔊 Listen to translations with text-to-speech.
* 📋 Copy translated text easily.

---

## 🚀 Features

* *Auto Detect Source Language* (or choose manually).
* *Multiple Target Languages* (English, Spanish, French, German, Hindi, Chinese, etc.).
* *Speech Input*: Convert speech to text via microphone.
* *Translation*: Powered by deep-translator (Google Translator API).
* *Speech Output*: Listen to translated text using gTTS.
* *Clipboard Support*: Copy translations instantly.
* *Session State*: Keeps track of input and translation until cleared.

---

## 📦 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/siddharth842147/Translator.git
cd Translator
```

### 2️⃣ Create & Activate Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run the App (Streamlit)

```bash
streamlit run translation_app.py
```

---

## 📋 Requirements

Add this to requirements.txt:

```txt
streamlit
deep-translator
SpeechRecognition
gTTS
pyttsx3
```

---

## 🎮 Usage

1. Select *Source Language* (or keep Auto Detect).
2. Enter text manually *OR* use 🎤 *Speech Input*.
3. Choose a *Target Language*.
4. Click *🔄 Translate*.
5. Listen to the translation with *🔊 Play Translation* or copy it with *📋 Copy Translation*.

---

## 🖼 UI Preview

* *Left Panel*: Input text or use speech input.
* *Right Panel*: Translation output with TTS and copy options.

---

## ⚡ Tech Stack

* *Frontend*: [Streamlit](https://streamlit.io/)
* *Translation*: [deep-translator](https://pypi.org/project/deep-translator/) (Google Translate API)
* *Speech Recognition*: [SpeechRecognition](https://pypi.org/project/SpeechRecognition/)
* *Text-to-Speech*: [gTTS](https://pypi.org/project/gTTS/)

---

## 🧹 Clear Cache

Use the *🗑 Clear All* button to reset session state.

---

## 🌐 Deploy to Netlify

This project is fully configured for zero-config Netlify deployment:

### Fast Deploy (GitHub):
1. Push this repository to GitHub.
2. Sign in to [Netlify](https://app.netlify.com/).
3. Click **Add new site** > **Import an existing project** > **GitHub**.
4. Select your repository. Netlify will auto-detect settings from `netlify.toml`:
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions`
5. Click **Deploy Site**.

### Deploy via Netlify CLI:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 📜 License

This project is licensed under the MIT License.
