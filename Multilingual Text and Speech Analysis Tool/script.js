/* =========================================
   ELEMENTS
========================================= */

const textInput = document.getElementById("textInput");

const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");

const languageSelect = document.getElementById("language");

const sentimentResult =
    document.getElementById("sentimentResult");

const sentimentScore =
    document.getElementById("sentimentScore");

const sentimentBar =
    document.getElementById("sentimentBar");

const languageResult =
    document.getElementById("languageResult");

const wordsResult =
    document.getElementById("wordsResult");

const charactersResult =
    document.getElementById("charactersResult");

const sentencesResult =
    document.getElementById("sentencesResult");

const keywordsList =
    document.getElementById("keywordsList");

const insightText =
    document.getElementById("insightText");

const speechStatus =
    document.getElementById("speechStatus");


/* =========================================
   WORD COUNTER
========================================= */

textInput.addEventListener("input", updateCounters);

function updateCounters() {

    const text = textInput.value;

    const characters = text.length;

    const words = getWords(text).length;

    charCount.textContent =
        `${characters} characters`;

    wordCount.textContent =
        `${words} words`;
}


/* =========================================
   GET WORDS
========================================= */

function getWords(text) {

    if (!text.trim()) {
        return [];
    }

    return text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);
}


/* =========================================
   ANALYZE TEXT
========================================= */

function analyzeText() {

    const text = textInput.value.trim();

    if (!text) {

        alert(
            "Please enter some text or use the microphone first."
        );

        return;
    }


    const words = getWords(text);

    const characters = text.length;

    const sentences =
        text.split(/[.!?।]+/)
            .filter(sentence => sentence.trim().length > 0)
            .length;


    /* Statistics */

    wordsResult.textContent = words.length;

    charactersResult.textContent =
        characters;

    sentencesResult.textContent =
        sentences;


    /* Language */

    const language =
        detectLanguage(text);

    languageResult.textContent =
        language;


    /* Sentiment */

    const sentiment =
        detectSentiment(text);

    sentimentResult.textContent =
        sentiment.label;

    sentimentScore.textContent =
        sentiment.score + "%";

    sentimentBar.style.width =
        sentiment.score + "%";


    /* Keywords */

    const keywords =
        extractKeywords(text);

    displayKeywords(keywords);


    /* Insight */

    generateInsight(
        sentiment,
        words.length,
        language,
        keywords.length
    );

}


/* =========================================
   LANGUAGE DETECTION
========================================= */

function detectLanguage(text) {

    const selected =
        languageSelect.value;


    if (selected !== "auto") {

        const languageNames = {

            en: "English",
            te: "Telugu",
            hi: "Hindi",
            ta: "Tamil",
            kn: "Kannada",
            ml: "Malayalam",
            fr: "French",
            de: "German",
            es: "Spanish",
            ja: "Japanese"

        };

        return languageNames[selected];
    }


    /*
       Basic browser-side detection.

       This is not a full AI language detection
       engine, but works for common scripts.
    */

    if (/[\u0C00-\u0C7F]/.test(text)) {
        return "Telugu";
    }

    if (/[\u0900-\u097F]/.test(text)) {
        return "Hindi";
    }

    if (/[\u0B80-\u0BFF]/.test(text)) {
        return "Tamil";
    }

    if (/[\u0C80-\u0CFF]/.test(text)) {
        return "Kannada";
    }

    if (/[\u0D00-\u0D7F]/.test(text)) {
        return "Malayalam";
    }

    if (/[\u3040-\u30FF]/.test(text)) {
        return "Japanese";
    }

    return "English / Latin";
}


/* =========================================
   SENTIMENT ANALYSIS
========================================= */

function detectSentiment(text) {

    const lowerText =
        text.toLowerCase();


    const positiveWords = [

        "good",
        "great",
        "excellent",
        "amazing",
        "awesome",
        "happy",
        "love",
        "like",
        "wonderful",
        "best",
        "beautiful",
        "fantastic",
        "perfect",
        "enjoy",
        "enjoyed",
        "success",
        "successful",
        "positive",
        "nice",
        "helpful",
        "thank",
        "thanks",
        "super",
        "excited"

    ];


    const negativeWords = [

        "bad",
        "worst",
        "hate",
        "sad",
        "angry",
        "poor",
        "terrible",
        "awful",
        "horrible",
        "problem",
        "fail",
        "failure",
        "negative",
        "disappointed",
        "disappointing",
        "difficult",
        "wrong",
        "boring",
        "slow",
        "error",
        "issue"

    ];


    let positive = 0;
    let negative = 0;


    positiveWords.forEach(word => {

        if (lowerText.includes(word)) {
            positive++;
        }

    });


    negativeWords.forEach(word => {

        if (lowerText.includes(word)) {
            negative++;
        }

    });


    if (positive > negative) {

        const score =
            Math.min(
                95,
                65 + positive * 7
            );

        return {
            label: "Positive",
            score: score
        };

    }


    if (negative > positive) {

        const score =
            Math.min(
                95,
                65 + negative * 7
            );

        return {
            label: "Negative",
            score: score
        };

    }


    return {
        label: "Neutral",
        score: 50
    };
}


/* =========================================
   KEYWORD EXTRACTION
========================================= */

function extractKeywords(text) {

    const stopWords = [

        "the",
        "and",
        "for",
        "are",
        "with",
        "this",
        "that",
        "from",
        "have",
        "has",
        "was",
        "were",
        "will",
        "would",
        "could",
        "should",
        "about",
        "into",
        "your",
        "you",
        "our",
        "their",
        "there",
        "they",
        "them",
        "then",
        "than",
        "also",
        "very",
        "just",
        "been",
        "being",
        "but",
        "not",
        "can",
        "its",
        "it's",
        "a",
        "an",
        "is",
        "in",
        "on",
        "of",
        "to",
        "it",
        "i",
        "we",
        "me",
        "my",
        "as",
        "or",
        "be",
        "at"
    ];


    const words =
        text
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, "")
            .split(/\s+/)
            .filter(word =>
                word.length > 3 &&
                !stopWords.includes(word)
            );


    const frequency = {};


    words.forEach(word => {

        frequency[word] =
            (frequency[word] || 0) + 1;

    });


    return Object.entries(frequency)

        .sort((a, b) => b[1] - a[1])

        .slice(0, 8)

        .map(item => item[0]);
}


/* =========================================
   DISPLAY KEYWORDS
========================================= */

function displayKeywords(keywords) {

    keywordsList.innerHTML = "";


    if (keywords.length === 0) {

        keywordsList.innerHTML =
            `<span class="keyword-placeholder">
                No important keywords detected
            </span>`;

        return;
    }


    keywords.forEach(keyword => {

        const span =
            document.createElement("span");

        span.className =
            "keyword";

        span.textContent =
            keyword;

        keywordsList.appendChild(span);

    });
}


/* =========================================
   GENERATE INSIGHT
========================================= */

function generateInsight(
    sentiment,
    wordCount,
    language,
    keywordCount
) {

    let message = "";


    if (sentiment.label === "Positive") {

        message =
            `The content has a positive tone. ` +
            `The analysis identified ${wordCount} words ` +
            `and ${keywordCount} important keywords ` +
            `in ${language}.`;

    }

    else if (sentiment.label === "Negative") {

        message =
            `The content has a negative tone. ` +
            `The analysis identified ${wordCount} words ` +
            `and ${keywordCount} important keywords ` +
            `in ${language}.`;

    }

    else {

        message =
            `The content appears relatively neutral. ` +
            `It contains ${wordCount} words and ` +
            `${keywordCount} important keywords ` +
            `in ${language}.`;

    }


    insightText.textContent =
        message;
}


/* =========================================
   CLEAR
========================================= */

function clearText() {

    textInput.value = "";

    updateCounters();

    sentimentResult.textContent =
        "Waiting...";

    sentimentScore.textContent =
        "--";

    sentimentBar.style.width =
        "0%";

    languageResult.textContent =
        "--";

    wordsResult.textContent =
        "0";

    charactersResult.textContent =
        "0";

    sentencesResult.textContent =
        "0";

    keywordsList.innerHTML =
        `<span class="keyword-placeholder">
            Analyze text to discover keywords
        </span>`;

    insightText.textContent =
        `Enter content and click "Analyze Text"
        to generate insights.`;
}


/* =========================================
   SPEECH RECOGNITION
========================================= */

let recognition;

function startSpeech() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
        );

        return;
    }


    recognition =
        new SpeechRecognition();


    recognition.continuous = false;

    recognition.interimResults = false;


    const language =
        languageSelect.value;


    const speechLanguages = {

        en: "en-IN",
        te: "te-IN",
        hi: "hi-IN",
        ta: "ta-IN",
        kn: "kn-IN",
        ml: "ml-IN",
        fr: "fr-FR",
        de: "de-DE",
        es: "es-ES",
        ja: "ja-JP"

    };


    recognition.lang =
        speechLanguages[language] ||
        "en-IN";


    speechStatus.innerHTML =
        `<span class="status-dot"></span>
        Listening... Speak now`;


    recognition.start();


    recognition.onresult = function(event) {

        const transcript =
            event.results[0][0].transcript;


        textInput.value =
            textInput.value
                ? textInput.value + " " + transcript
                : transcript;


        updateCounters();


        analyzeText();


        speechStatus.innerHTML =
            `<span class="status-dot"></span>
            Voice input captured successfully`;

    };


    recognition.onerror = function(event) {

        speechStatus.innerHTML =
            `<span class="status-dot"></span>
            Voice recognition error: ${event.error}`;

    };


    recognition.onend = function() {

        if (
            speechStatus.textContent
                .includes("Listening")
        ) {

            speechStatus.innerHTML =
                `<span class="status-dot"></span>
                Voice recognition stopped`;

        }

    };

}


/* =========================================
   SCROLL
========================================= */

function scrollToAnalyzer() {

    document
        .getElementById("analyzer")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================
   INITIALIZATION
========================================= */

updateCounters();