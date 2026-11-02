const https = require("https");

function fetchHttps(url) {
  return new Promise((resolve, reject) => {
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
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(data);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 100)}`));
            }
          });
        }
      )
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Netlify Serverless Function: Translation proxy
exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const { text, sourceLang = "auto", targetLang = "en" } = payload;

    if (!text || !text.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Text to translate is required." }),
      };
    }

    const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      sourceLang
    )}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;

    let rawData = "";
    if (typeof fetch === "function") {
      try {
        const res = await fetch(endpoint, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        if (res.ok) {
          rawData = await res.text();
        }
      } catch (fetchErr) {
        // Fall back to native https
      }
    }

    if (!rawData) {
      rawData = await fetchHttps(endpoint);
    }

    const data = JSON.parse(rawData);
    let translatedText = "";

    if (Array.isArray(data[0])) {
      translatedText = data[0]
        .map((sentence) => (sentence && sentence[0] ? sentence[0] : ""))
        .join("");
    }

    const detectedSource = data[2] || sourceLang;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        translation: translatedText,
        detectedSource,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Failed to process translation.",
      }),
    };
  }
};
