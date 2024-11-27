let mileageCategories = [];
let students = [];

// Home 버튼 클릭 시 이동
function goToHomePage() {
    window.location.href = "index.html";
}

// 마일리지 추가
function addMileage() {
    const studentId = document.getElementById("student-id").value;
    const mileageTypeSelect = document.getElementById("mileage-type");
    const mileageType = mileageTypeSelect.options[mileageTypeSelect.selectedIndex]?.text;
    const points = parseInt(mileageTypeSelect.value);
    const date = document.getElementById("mileage-date").value;

    // 검증 로직
    if (!studentId || !mileageType || isNaN(points) || !date) {
        alert("학생, 마일리지 카테고리, 날짜를 모두 선택하세요.");
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
    // Home 버튼
    document.getElementById("home-button").addEventListener("click", goToHomePage);

    // 비밀번호 인증
    document.getElementById("teacher-password").addEventListener("keypress", (event) => {
        if (event.key === "Enter") authenticate();
    });
    document.getElementById("authenticate-button").addEventListener("click", authenticate);

    // 학생 등록
    document.getElementById("student-name").addEventListener("keypress", (event) => {
        if (event.key === "Enter") registerStudent();
    });
    document.getElementById("register-button").addEventListener("click", registerStudent);

    // 학생 삭제
    document.getElementById("delete-button").addEventListener("click", deleteStudent);

    // 마일리지 카테고리 추가
    document.getElementById("add-category-button").addEventListener("click", addMileageCategory);

    // 마일리지 추가
    document.getElementById("add-mileage-button").addEventListener("click", addMileage);

    fetchStudents();
    fetchMileageCategories();
});

// 비밀번호 인증
function authenticate() {
    const password = document.getElementById("teacher-password").value;
    if (password === "1002") {
        alert("비밀번호 인증 성공!");
        document.getElementById("mileage-management").style.display = "block";
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

// 카테고리 불러오기
function fetchMileageCategories() {
    fetch('/api/mileage-categories')
        .then(response => response.json())
        .then(categories => {
            mileageCategories = categories;
            updateSelectOptions(
                "mileage-type",
                mileageCategories.map(c => ({ id: c.name, name: `${c.name} (${c.points}점)` })),
                "마일리지 카테고리를 선택하세요"
            );
        })
        .catch(error => alert("마일리지 카테고리 불러오기 실패: " + error.message));
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
            fetchStudents();
        })
        .catch(error => alert("학생 등록 실패: " + error.message));
}

// 학생 삭제
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
        .catch(error => alert("학생 삭제 실패: " + error.message));
}

// 카테고리 추가
function addMileageCategory() {
    const name = document.getElementById("mileage-category-name").value.trim();
    const points = parseInt(document.getElementById("mileage-category-points").value);

    if (!name || isNaN(points)) {
        alert("카테고리 이름과 포인트를 입력하세요.");
        return;
    }

    fetch('/api/add-mileage-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, points })
    })
        .then(response => response.json())
        .then(data => alert(`카테고리 추가 완료: ${data.category.name}`))
        .catch(error => alert("카테고리 추가 실패: " + error.message));
}
