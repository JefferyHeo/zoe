let mileageCategories = [];
let students = [];

// Home 버튼 이동
function goToHomePage() {
    window.location.href = "index.html";
}

// 선택된 날짜 가져오기
function getSelectedDate() {
    const year = document.getElementById("year-select").value;
    const month = document.getElementById("month-select").value;
    const day = document.getElementById("day-select").value;

    if (!year || !month || !day) {
        alert("날짜를 모두 선택하세요.");
        return null;
    }

    return `${year}-${month}-${day}`;
}

// 마일리지 추가
function addMileage() {
    const studentId = document.getElementById("student-id").value;
    const mileageTypeSelect = document.getElementById("mileage-type");
    const mileageType = mileageTypeSelect.options[mileageTypeSelect.selectedIndex]?.text;
    const points = parseInt(mileageTypeSelect.value);
    const date = getSelectedDate();

    // 검증 로직 수정
    if (!studentId) {
        alert("학생을 선택하세요.");
        return;
    }
    if (!mileageType || isNaN(points)) {
        alert("마일리지 카테고리를 선택하세요.");
        return;
    }
    if (!date) {
        // getSelectedDate에서 이미 경고를 표시하므로 여기서 추가 경고는 불필요
        return;
    }

    fetch('/api/add-mileage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, mileageType, points, date })
    })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => alert("마일리지 추가 실패: " + error.message));
}

// DOMContentLoaded 이벤트
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("home-button").addEventListener("click", goToHomePage);
    document.getElementById("teacher-password").addEventListener("keypress", (event) => handleEnter(event, "authenticate-button"));
    document.getElementById("authenticate-button").addEventListener("click", authenticate);
    document.getElementById("student-name").addEventListener("keypress", (event) => handleEnter(event, "register-button"));
    document.getElementById("register-button").addEventListener("click", registerStudent);
    document.getElementById("delete-button").addEventListener("click", deleteStudent);
    document.getElementById("add-category-button").addEventListener("click", addMileageCategory);
    document.getElementById("add-mileage-button").addEventListener("click", () => {
        addMileage(); // 버튼 클릭 시 한 번만 실행되도록 설정
    });

    initializeYearOptions();
    initializeMonthOptions();
    initializeDayOptions();

    // 연도 및 월 변경 시 일 옵션 업데이트
    document.getElementById("month-select").addEventListener("change", initializeDayOptions);
    document.getElementById("year-select").addEventListener("change", initializeDayOptions);
});

// 유틸리티 함수: 엔터키로 버튼 클릭
function handleEnter(event, buttonId) {
    if (event.key === "Enter") {
        event.preventDefault(); // 폼 제출 방지
        document.getElementById(buttonId).click();
    }
}

// 날짜 드롭다운 초기화 함수
function initializeYearOptions() {
    const yearSelect = document.getElementById("year-select");
    const currentYear = new Date().getFullYear();

    yearSelect.innerHTML = ""; // 초기화

    for (let i = currentYear; i >= currentYear - 100; i--) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${i}년`;
        yearSelect.appendChild(option);
    }
}

function initializeMonthOptions() {
    const monthSelect = document.getElementById("month-select");

    monthSelect.innerHTML = ""; // 초기화

    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.value = i.toString().padStart(2, '0');
        option.textContent = `${i}월`;
        monthSelect.appendChild(option);
    }
}

function initializeDayOptions() {
    const year = parseInt(document.getElementById("year-select").value);
    const month = parseInt(document.getElementById("month-select").value);
    const daySelect = document.getElementById("day-select");

    daySelect.innerHTML = ""; // 초기화

    if (!year || !month) return;

    const daysInMonth = new Date(year, month, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement("option");
        option.value = i.toString().padStart(2, '0');
        option.textContent = `${i}일`;
        daySelect.appendChild(option);
    }
}
