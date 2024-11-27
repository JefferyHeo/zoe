let mileageCategories = []; // 클라이언트에서 관리하는 마일리지 카테고리 목록
let students = []; // 학생 목록

function handleEnter(event, action) {
    if (event.key === 'Enter') {
        action();
    }
}

// Home으로 이동
function goToHomePage() {
    window.location.href = "http://13.239.36.224:3000/index.html";
}

// DOMContentLoaded 이벤트 핸들러
document.addEventListener("DOMContentLoaded", () => {
    // Home 버튼 클릭 시 이동
    const homeButton = document.getElementById("home-button");
    homeButton.addEventListener("click", goToHomePage);
});


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

function deleteStudent() {
    const studentId = document.getElementById("delete-student-id").value;

    if (!studentId) {
        alert("삭제할 학생을 선택하세요.");
        return;
    }

    fetch(`/api/delete-student/${studentId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchStudents();
        })
        .catch(error => alert('학생 삭제 실패: ' + error.message));
}

function fetchMileageCategories() {
    fetch('/api/mileage-categories')
        .then(response => response.json())
        .then(categories => {
            mileageCategories = categories;
            updateSelectOptions("mileage-type", mileageCategories.map(c => ({ id: c.points, name: `${c.name} (${c.points}점)` })), "마일리지 카테고리를 선택하세요");
        })
        .catch(error => alert('마일리지 카테고리 불러오기 실패: ' + error.message));
}

function addMileageCategory() {
    const name = document.getElementById("mileage-category-name").value.trim();
    const points = parseInt(document.getElementById("mileage-category-points").value);

    if (!name || isNaN(points)) {
        alert("카테고리 이름과 포인트를 올바르게 입력하세요.");
        return;
    }

    fetch('/api/add-mileage-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, points })
    })
    .then(response => response.json())
    .then(data => {
        alert(`마일리지 카테고리 추가 완료: ${data.category.name} (${data.category.points}점)`);
        document.getElementById("mileage-category-name").value = "";
        document.getElementById("mileage-category-points").value = "";
        fetchMileageCategories();
    })
    .catch(error => alert('카테고리 추가 실패: ' + error.message));
}

function addMileage() {
    const studentId = document.getElementById("student-id").value;
    const points = parseInt(document.getElementById("mileage-type").value);
    const mileageType = document.getElementById("mileage-type").options[document.getElementById("mileage-type").selectedIndex].text;
    const date = document.getElementById("mileage-date").value;

    if (!studentId || isNaN(points) || !date) {
        alert("학생, 마일리지 카테고리, 날짜를 모두 선택하세요.");
        return;
    }

    fetch('/api/add-mileage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, mileageType, points, date })
    })
    .then(response => response.json())
    .then(data => {
        alert("마일리지 부여 완료");
    })
    .catch(error => alert("마일리지 추가 실패: " + error.message));
}

// 페이지 로드 시 초기 데이터 불러오기
document.addEventListener("DOMContentLoaded", () => {
    fetchMileageCategories();
    fetchStudents();
});
