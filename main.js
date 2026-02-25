const translations = {
    ko: {
        "main-title": "심심할 때 열어보는 페이지",
        "main-subtitle": "다양한 AI 서비스와 추천 기능을 즐겨보세요!",
        "menu-title": "오늘 저녁 뭐 먹지?",
        "menu-subtitle": "결정 장애를 위한 무작위 메뉴 추첨기",
        "menu-button": "메뉴 추첨하기",
        "ai-title": "동물상 테스트",
        "ai-subtitle": "나의 얼굴은 강아지상? 고양이상?",
        "ai-button": "테스트 하러가기",
        "contact-title": "제휴 문의",
        "contact-email": "이메일 주소",
        "contact-msg": "문의 내용을 입력해주세요",
        "contact-button": "문의 보내기",
        "back-home": "← 홈으로",
        "ai-test-title": "동물상 테스트",
        "ai-test-subtitle": "나의 얼굴은 강아지상일까, 고양이상일까?",
        "upload-text": "사진을 클릭하거나 드래그하여 업로드하세요",
        "loading-text": "AI가 분석 중입니다...",
        "retry-button": "다시 하기",
        "lang-toggle": "English",
        "theme-dark": "다크 모드",
        "theme-light": "라이트 모드"
    },
    en: {
        "main-title": "Boredom Buster Page",
        "main-subtitle": "Enjoy various AI services and recommendation features!",
        "menu-title": "What's for Dinner?",
        "menu-subtitle": "Random menu picker for the undecided",
        "menu-button": "Pick a Menu",
        "ai-title": "Animal Face Test",
        "ai-subtitle": "Is your face like a dog or a cat?",
        "ai-button": "Go to Test",
        "contact-title": "Partnership Inquiry",
        "contact-email": "Email Address",
        "contact-msg": "Please enter your inquiry",
        "contact-button": "Send Inquiry",
        "back-home": "← Home",
        "ai-test-title": "Animal Face Test",
        "ai-test-subtitle": "Are you a dog person or a cat person?",
        "upload-text": "Click or drag a photo to upload",
        "loading-text": "AI is analyzing...",
        "retry-button": "Try Again",
        "lang-toggle": "한국어",
        "theme-dark": "Dark Mode",
        "theme-light": "Light Mode"
    }
};

const menuOptions = {
    ko: ["치킨", "피자", "삼겹살", "떡볶이", "초밥", "파스타", "부대찌개", "된장찌개", "김치찌개", "곱창", "족발", "보쌈", "짜장면", "짬뽕", "탕수육", "돈까스", "냉면", "국밥", "햄버거", "샌드위치"],
    en: ["Chicken", "Pizza", "Pork Belly", "Tteokbokki", "Sushi", "Pasta", "Stew", "Soybean Stew", "Kimchi Stew", "Gopchang", "Jokbal", "Bossam", "Jajangmyeon", "Jjamppong", "Tangsuyuk", "Donkatsu", "Naengmyeon", "Gukbap", "Hamburger", "Sandwich"]
};

// 테마 및 언어 요소
const themeButton = document.getElementById("theme-button");
const langButton = document.getElementById("lang-button");
const body = document.body;

let currentLang = localStorage.getItem("lang") || "ko";

// --- 언어 로직 ---
function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    if (langButton) langButton.textContent = translations[lang]["lang-toggle"];
    updateThemeButtonText(localStorage.getItem("theme") || "light");
}

if (langButton) {
    langButton.addEventListener("click", () => {
        const newLang = currentLang === "ko" ? "en" : "ko";
        updateLanguage(newLang);
    });
}

// 초기 언어 설정
updateLanguage(currentLang);

// --- 테마 로직 ---
if (themeButton) {
    const savedTheme = localStorage.getItem("theme") || "light";
    body.setAttribute("data-theme", savedTheme);
    updateThemeButtonText(savedTheme);

    themeButton.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeButtonText(newTheme);
    });
}

function updateThemeButtonText(theme) {
    if (themeButton) {
        themeButton.textContent = theme === "light" ? translations[currentLang]["theme-dark"] : translations[currentLang]["theme-light"];
    }
}

// --- 메뉴 추첨 로직 ---
const drawButton = document.getElementById("draw-button");
const resultElement = document.getElementById("result");

if (drawButton && resultElement) {
    drawButton.addEventListener("click", () => {
        const options = menuOptions[currentLang];
        const randomIndex = Math.floor(Math.random() * options.length);
        const selectedMenu = options[randomIndex];
        resultElement.textContent = currentLang === "ko" 
            ? `오늘의 저녁 메뉴는... ${selectedMenu} 입니다!` 
            : `Today's dinner menu is... ${selectedMenu}!`;
    });
}

// --- AI 동물상 테스트 로직 (생략 없는 전체 로직) ---
const uploadArea = document.getElementById("upload-area");
const imageUpload = document.getElementById("image-upload");
const previewImage = document.getElementById("preview-image");
const uploadText = document.getElementById("upload-text");
const loadingSpinner = document.getElementById("loading-spinner");
const aiResultContainer = document.getElementById("ai-result-container");
const aiResultTitle = document.getElementById("ai-result-title");
const labelContainer = document.getElementById("label-container");
const retryButton = document.getElementById("retry-button");

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/YRUPEtfR2/";
let model, maxPredictions;

if (uploadArea && imageUpload) {
    async function initAI() {
        if (model) return;
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }

    uploadArea.addEventListener("click", () => imageUpload.click());

    imageUpload.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                previewImage.src = event.target.result;
                previewImage.style.display = "block";
                uploadText.style.display = "none";
                loadingSpinner.style.display = "block";
                aiResultContainer.style.display = "none";
                await initAI();
                predict();
            };
            reader.readAsDataURL(file);
        }
    });

const animalMapping = {
    "강아지": { ko: "강아지", en: "Dog" },
    "dog": { ko: "강아지", en: "Dog" },
    "고양이": { ko: "고양이", en: "Cat" },
    "cat": { ko: "고양이", en: "Cat" }
};

function getAnimalName(className, lang) {
    const lowerName = className.toLowerCase().trim();
    return animalMapping[lowerName] ? animalMapping[lowerName][lang] : className;
}

async function predict() {
    const prediction = await model.predict(previewImage);
    loadingSpinner.style.display = "none";
    aiResultContainer.style.display = "block";
    
    prediction.sort((a, b) => b.probability - a.probability);
    const topResult = prediction[0];
    
    // 동물 이름 번역 대응
    const translatedName = getAnimalName(topResult.className, currentLang);
    aiResultTitle.textContent = currentLang === "ko" ? `당신은 ${translatedName}상 입니다!` : `You are a ${translatedName} face!`;
    
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i];
        const percentage = (classPrediction.probability * 100).toFixed(0);
        const className = getAnimalName(classPrediction.className, currentLang);
        
        const barWrapper = document.createElement("div");
        barWrapper.className = "result-bar-wrapper";
        barWrapper.innerHTML = `
            <div class="bar-label">
                <span>${className}</span>
                <span>${percentage}%</span>
            </div>
            <div class="bar-container">
                <div class="bar-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        labelContainer.appendChild(barWrapper);
    }
}

    retryButton.addEventListener("click", () => {
        imageUpload.value = "";
        previewImage.style.display = "none";
        uploadText.style.display = "block";
        aiResultContainer.style.display = "none";
    });
}
