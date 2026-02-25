const menuOptions = [
    "치킨", "피자", "삼겹살", "떡볶이", "초밥", "파스타", "부대찌개", "된장찌개", "김치찌개", "곱창",
    "족발", "보쌈", "짜장면", "짬뽕", "탕수육", "돈까스", "냉면", "국밥", "햄버거", "샌드위치"
];

// 테마 및 공통 요소
const themeButton = document.getElementById("theme-button");
const body = document.body;

// 메뉴 추첨 요소
const drawButton = document.getElementById("draw-button");
const resultElement = document.getElementById("result");

// AI 동물상 테스트 요소
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

// --- 테마 로직 ---
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

function updateThemeButtonText(theme) {
    themeButton.textContent = theme === "light" ? "다크 모드" : "라이트 모드";
}

// --- 메뉴 추첨 로직 ---
drawButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * menuOptions.length);
    const selectedMenu = menuOptions[randomIndex];
    resultElement.textContent = `오늘의 저녁 메뉴는... ${selectedMenu} 입니다!`;
});

// --- AI 동물상 테스트 로직 ---
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

async function predict() {
    const prediction = await model.predict(previewImage);
    loadingSpinner.style.display = "none";
    aiResultContainer.style.display = "block";
    
    // 가장 높은 확률 찾기
    prediction.sort((a, b) => b.probability - a.probability);
    const topResult = prediction[0];
    
    aiResultTitle.textContent = `당신은 ${topResult.className}상 입니다!`;
    
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i];
        const percentage = (classPrediction.probability * 100).toFixed(0);
        
        const barWrapper = document.createElement("div");
        barWrapper.className = "result-bar-wrapper";
        barWrapper.innerHTML = `
            <div class="bar-label">
                <span>${classPrediction.className}</span>
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
