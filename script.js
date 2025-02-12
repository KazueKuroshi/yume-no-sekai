document.getElementById('translateBtn').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    const outputText = document.getElementById('outputText');

    if (!inputText) {
        alert('Masukkan teks terlebih dahulu!');
        return;
    }

    // Langkah 1: Terjemahkan teks menggunakan API
    const apiKey = 'YOUR_API_KEY_HERE'; // Ganti dengan API key Anda
    const targetLang = 'id'; // Bahasa target (contoh: Bahasa Indonesia)
    const translatedText = await translateText(inputText, apiKey, targetLang);

    // Langkah 2: Sesuaikan hasil terjemahan
    const adjustedText = adjustTranslation(translatedText);

    // Langkah 3: Tambahkan variasi kalimat
    const variedText = addSentenceVariety(adjustedText);

    // Langkah 4: Poles hasil terjemahan menggunakan NLP
    const refinedText = await refineTranslation(variedText);

    // Langkah 5: Tambahkan idiom
    const finalText = addIdioms(refinedText);

 outputText.textContent = finalText;
});

async function translateText(inputText, apiKey, targetLang) {
    const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: inputText,
                target: targetLang,
            }),
        }
    );

    const data = await response.json();
    return data.data.translations[0].translatedText;
}

function adjustTranslation(translatedText) {
    const replacements = {
        "saya": "aku",
        "anda": "kamu",
        "apakah": "apa",
        "mengapa": "kenapa",
        "ketika": "saat",
        "karena": "soalnya",
        "tetapi": "tapi",
        "namun": "tapi",
        "sehingga": "jadi",
        "oleh karena itu": "makanya",
    };

    let adjustedText = translatedText;
    for (const [baku, alami] of Object.entries(replacements)) {
        adjustedText = adjustedText.replace(new RegExp(baku, 'gi'), alami);
    }

    return adjustedText;
}

function addSentenceVariety(text) {
    text = text.replace(/dibuat oleh/g, 'membuat');
    text = text.replace(/diberikan kepada/g, 'memberikan');
    return text;
}

async function refineTranslation(translatedText) {
    const response = await fetch(
        'https://api.openai.com/v1/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: `Buat kalimat ini lebih alami dan seperti terjemahan manusia: "${translatedText}"`,
                max_tokens: 100,
                temperature: 0.7,
            }),
        }
    );

    const data = await response.json();
    return data.choices[0].text.trim();
}

function addIdioms(text) {
    const idioms = {
        "sangat baik": "mantap banget",
        "sangat buruk": "parah banget",
        "sangat penting": "krusial banget",
    };

    let adjustedText = text;
    for (const [baku, idiom] of Object.entries(idioms)) {
        adjustedText = adjustedText.replace(new RegExp(baku, 'gi'), idiom);
    }

    return adjustedText;
}
