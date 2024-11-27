let mileageCategories = [];
let students = [];

// 홈 버튼으로 이동
function goToHomePage() {
    window.location.href = "http://13.239.36.224:3000/index.html";
}

// 엔터 키 핸들러
function handleEnter(event, buttonId) {
    if (event.key === "Enter") {
        document.getElementById(buttonId).click();
    }
}

// 인증 기능
function authenticate() {
    const password = document.getElementById("teacher-password").value;
    const correctPassword = "1002"; // 고정된 비밀번호

    if (password === correctPassword) {
        alert("비밀번호 인증 성공!");
        document.getElementById("mileage-management").style.display = "block";
        document.getElementById("teacher-password").disabled = true;
        document.getElementById("authenticate-button").disabled = true;
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
        .catch(error => alert('학생 목록 불러오기 실패: ' + error.message));
}

// 드롭다운 옵션 업데이트
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
        document.getElementById("student-name").value = ""; // 입력 필드 초기화
        fetchStudents();
    })
    .catch(error => alert('학생 등록 실패: ' + error.message));
}

// 페이지 로드 시 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
    fetchMileageCategories();
    fetchStudents();

    // 홈 버튼
    document.getElementById("home-button").addEventListener("click", goToHomePage);

    // 조회 버튼
    document.getElementById("authenticate-button").addEventListener("click", authenticate);

    // 등록 버튼
    document.getElementById("register-button").addEventListener("click", registerStudent);

    // 엔터키 동작 추가
    document.getElementById("teacher-password").addEventListener("keypress", (event) => handleEnter(event, "authenticate-button"));
    document.getElementById("student-name").addEventListener("keypress", (event) => handleEnter(event, "register-button"));
});
