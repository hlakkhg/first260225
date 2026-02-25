
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

drawButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * menuOptions.length);
    const selectedMenu = menuOptions[randomIndex];
    resultElement.textContent = `오늘의 저녁 메뉴는... ${selectedMenu} 입니다!`;
});
