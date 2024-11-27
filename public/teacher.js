let mileageCategories = []; // 클라이언트에서 관리하는 마일리지 카테고리 목록
let students = []; // 학생 목록

// Home으로 이동
function goToHomePage() {
    window.location.href = "http://13.239.36.224:3000/index.html";
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

// 페이지 로드 시 초기 데이터 불러오기
document.addEventListener("DOMContentLoaded", () => {
    fetchMileageCategories();
    fetchStudents();

    // 이벤트 리스너 설정
    document.getElementById("home-button").addEventListener("click", goToHomePage);
    document.getElementById("authenticate-button").addEventListener("click", authenticate);
    document.getElementById("register-button").addEventListener("click", registerStudent);

    // 엔터키 이벤트 추가
    document.getElementById("teacher-password").addEventListener("keypress", (event) => handleEnter(event, "authenticate-button"));
    document.getElementById("student-name").addEventListener("keypress", (event) => handleEnter(event, "register-button"));
});
