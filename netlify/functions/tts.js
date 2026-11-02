const https = require("https");

function getGoogleTTS(text, lang) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "*/*",
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            return reject(new Error(`Google TTS status code: ${res.statusCode}`));
          }
          const chunks = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => resolve(Buffer.concat(chunks)));
        }
      )
      .on("error", (err) => reject(err));
  });
}

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    let text = "";
    let lang = "en";

    if (event.httpMethod === "GET") {
      const params = event.queryStringParameters || {};
      text = params.text || "";
      lang = params.lang || "en";
    } else if (event.httpMethod === "POST") {
      const payload = JSON.parse(event.body || "{}");
      text = payload.text || "";
      lang = payload.lang || "en";
    }

    if (!text || !text.trim()) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Text parameter is required." }),
      };
    }

    const audioBuffer = await getGoogleTTS(text.trim(), lang);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400",
      },
      isBase64Encoded: true,
      body: audioBuffer.toString("base64"),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Failed to generate TTS audio." }),
    };
  }
};
