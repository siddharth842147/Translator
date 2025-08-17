import streamlit as st
from deep_translator import GoogleTranslator
import speech_recognition as sr
import pyttsx3
from gtts import gTTS
import io
import tempfile
import os
from threading import Thread
import time

# Configure page
st.set_page_config(
    page_title="AI Translator",
    page_icon="🌍",
    layout="wide"
)

# Language mapping for display names
LANGUAGES = {
    'auto': 'Auto Detect',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'he': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'or': 'Odia (Oriya)',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'ug': 'Uyghur',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
}
def translate_text(text, source_lang, target_lang):
    """Translate text using GoogleTranslator"""
    try:
        if source_lang == 'auto':
            translator = GoogleTranslator(source='auto', target=target_lang)
        else:
            translator = GoogleTranslator(source=source_lang, target=target_lang)
        
        result = translator.translate(text)
        return result
    except Exception as e:
        return f"Translation error: {str(e)}"

def speech_to_text():
    """Convert speech to text using microphone"""
    try:
        r = sr.Recognizer()
        with sr.Microphone() as source:
            st.info("🎤 Listening... Speak now!")
            r.adjust_for_ambient_noise(source)
            audio = r.listen(source, timeout=5, phrase_time_limit=10)
            
        text = r.recognize_google(audio)
        return text
    except sr.WaitTimeoutError:
        return "⚠ No speech detected. Please try again."
    except sr.UnknownValueError:
        return "⚠ Could not understand the audio. Please try again."
    except Exception as e:
        return f"⚠ Speech recognition error: {str(e)}"

def text_to_speech(text, lang_code):
    """Convert text to speech"""
    try:
        tts = gTTS(text=text, lang=lang_code, slow=False)
        
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
            tts.save(tmp_file.name)
            return tmp_file.name
    except Exception as e:
        st.error(f"Text-to-speech error: {str(e)}")
        return None

# App title and header
st.title("🌍 AI Translator")
st.markdown("### Translate text instantly with speech support!")
st.markdown("---")

# Create columns for layout
col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("📝 Input")
    
    # Language selection for source
    source_lang = st.selectbox(
        "Source Language:",
        options=list(LANGUAGES.keys()),
        format_func=lambda x: LANGUAGES[x],
        index=0  # Auto detect by default
    )
    
    # Text input area
    input_text = st.text_area(
        "Enter text to translate:",
        height=150,
        placeholder="Type your text here or use the microphone button below..."
    )
    
    # Speech input button
    col1_1, col1_2 = st.columns([1, 1])
    
    with col1_1:
        if st.button("🎤 Speech Input", use_container_width=True):
            with st.spinner("Listening..."):
                speech_result = speech_to_text()
                if not speech_result.startswith("⚠"):
                    st.session_state.speech_text = speech_result
                    st.success(f"Captured: {speech_result}")
                else:
                    st.error(speech_result)
    
    # Use speech text if available
    if 'speech_text' in st.session_state and st.session_state.speech_text:
        input_text = st.session_state.speech_text

with col2:
    st.subheader("🎯 Translation")
    
    # Language selection for target
    target_lang = st.selectbox(
        "Target Language:",
        options=[k for k in LANGUAGES.keys() if k != 'auto'],
        format_func=lambda x: LANGUAGES[x],
        index=0  # English by default
    )
    
    # Translation output area
    if input_text and input_text.strip():
        if st.button("🔄 Translate", use_container_width=True, type="primary"):
            with st.spinner("Translating..."):
                translated = translate_text(input_text, source_lang, target_lang)
                st.session_state.translation = translated
                st.session_state.target_lang = target_lang
        
        # Display translation result
        if 'translation' in st.session_state:
            st.text_area(
                "Translation:",
                value=st.session_state.translation,
                height=150,
                disabled=True
            )
            
            # Text-to-speech for translation
            col2_1, col2_2 = st.columns([1, 1])
            
            with col2_1:
                if st.button("🔊 Play Translation", use_container_width=True):
                    with st.spinner("Generating speech..."):
                        audio_file = text_to_speech(
                            st.session_state.translation, 
                            st.session_state.target_lang
                        )
                        if audio_file:
                            st.audio(audio_file)
                            # Clean up temporary file after a delay
                            def cleanup_file(filepath):
                                time.sleep(10)  # Wait 10 seconds before cleanup
                                try:
                                    os.unlink(filepath)
                                except:
                                    pass
                            Thread(target=cleanup_file, args=(audio_file,)).start()
            
            with col2_2:
                if st.button("📋 Copy Translation", use_container_width=True):
                    st.code(st.session_state.translation)
                    st.success("Translation copied to clipboard area above!")
    else:
        st.info("👆 Enter text above to see translation here")



# Clear session state button (for development)
if st.button("🗑 Clear All", help="Clear all cached translations"):
    for key in list(st.session_state.keys()):
        del st.session_state[key]
    st.rerun()

# Footer
st.markdown("---")