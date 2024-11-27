let mileageCategories = [];
let students = [];

// Home 버튼 이벤트 핸들러
function goToHomePage() {
    window.location.href = "index.html";
}

// 엔터키로 버튼 클릭
function handleEnter(event, buttonId) {
    if (event.key === "Enter") {
        document.getElementById(buttonId).click();
    }
}

// 비밀번호 인증
function authenticate() {
    const password = document.getElementById("teacher-password").value;
    const correctPassword = "1002";

    if (password === correctPassword) {
        alert("비밀번호 인증 성공!");
        document.getElementById("mileage-management").style.display = "block";

        // 비밀번호 입력 필드 및 버튼 숨기기
        document.getElementById("password-section").style.display = "none";

        fetchStudents();
        fetchMileageCategories();
    } else {
        alert("비밀번호가 틀렸습니다.");
    }
}

// 학생 목록 불러오기
function fetchStudents() {
    fetch('/api/students')
        .then(response => response.json())
        .then(data => {
            students = data;
            updateSelectOptions("student-id", students, "학생을 선택하세요");
            updateSelectOptions("delete-student-id", students, "삭제할 학생을 선택하세요");
        })
        .catch(error => alert("학생 목록 불러오기 실패: " + error.message));
}

// 선택 옵션 업데이트
function updateSelectOptions(selectId, optionsData, placeholder) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = `<option disabled selected>${placeholder}</option>`;

    optionsData.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
}

// 학생 등록
function registerStudent() {
    const name = document.getElementById("student-name").value.trim();

    if (!name) {
        alert("학생 이름을 입력하세요.");
        return;
    }

    fetch('/api/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
        .then(response => response.json())
        .then(data => {
            alert(`학생 등록 완료: ${data.name}`);
            document.getElementById("student-name").value = "";
            fetchStudents();
        })
        .catch(error => alert("학생 등록 실패: " + error.message));
}

// 마일리지 추가
function addMileage() {
    const studentId = document.getElementById("student-id").value;
    const mileageTypeSelect = document.getElementById("mileage-type");
    const mileageType = mileageTypeSelect.options[mileageTypeSelect.selectedIndex]?.text;
    const points = parseInt(mileageTypeSelect.value);

    if (!studentId || !mileageType || isNaN(points)) {
        alert("학생과 마일리지 카테고리를 모두 선택하세요.");
        return;
    }

    fetch('/api/add-mileage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, mileageType, points })
    })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error("마일리지 추가 실패:", error));
}

// DOMContentLoaded 이벤트
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("home-button").addEventListener("click", goToHomePage);
    document.getElementById("teacher-password").addEventListener("keypress", (event) => handleEnter(event, "authenticate-button"));
    document.getElementById("authenticate-button").addEventListener("click", authenticate);
    document.getElementById("student-name").addEventListener("keypress", (event) => handleEnter(event, "register-button"));
    document.getElementById("register-button").addEventListener("click", registerStudent);
    document.getElementById("add-mileage-button").addEventListener("click", addMileage);
});
