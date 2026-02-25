const menuOptions = [
    "치킨",
    "피자",
    "삼겹살",
    "떡볶이",
    "초밥",
    "파스타",
    "부대찌개",
    "된장찌개",
    "김치찌개",
    "곱창",
    "족발",
    "보쌈",
    "짜장면",
    "짬뽕",
    "탕수육",
    "돈까스",
    "냉면",
    "국밥",
    "햄버거",
    "샌드위치"
];

const drawButton = document.getElementById("draw-button");
const resultElement = document.getElementById("result");
const themeButton = document.getElementById("theme-button");
const body = document.body;

// 메뉴 추첨 기능
drawButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * menuOptions.length);
    const selectedMenu = menuOptions[randomIndex];
    resultElement.textContent = `오늘의 저녁 메뉴는... ${selectedMenu} 입니다!`;
});

// 테마 초기화
const savedTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", savedTheme);
updateThemeButtonText(savedTheme);

// 테마 토글 기능
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
