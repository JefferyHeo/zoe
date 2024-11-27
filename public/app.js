// 학생 마일리지 조회 함수
function fetchMileage() {
    const studentName = document.getElementById("student-name").value.trim();

    if (!studentName) {
        alert("학생 이름을 입력하세요.");
        return;
    }

    const encodedName = encodeURIComponent(studentName);

    fetch(`/api/mileage/${encodedName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("네트워크 응답에 문제가 있습니다.");
            }
            return response.json();
        })
        .then(data => {
            const totalMileage = data.totalMileage || 0;
            document.getElementById("total-mileage").textContent = `총 마일리지: ${totalMileage}점`;
            document.getElementById("student-name-display").textContent = `학생 이름: ${data.studentName}`;

            const mileageLog = document.getElementById("mileage-log");
            mileageLog.innerHTML = "";

            if (Array.isArray(data.log) && data.log.length > 0) {
                data.log.forEach(entry => {
                    const date = entry.date || "날짜 없음";
                    const listItem = document.createElement("li");
                    listItem.textContent = `${date} - ${entry.mileageType}: ${entry.points}점`;
                    mileageLog.appendChild(listItem);
                });
            } else {
                const listItem = document.createElement("li");
                listItem.textContent = "마일리지 내역이 없습니다.";
                mileageLog.appendChild(listItem);
            }
        })
        .catch(error => alert("마일리지 조회 실패: " + error.message));
}

// 교사 페이지 이동
function goToTeacherPage() {
    window.location.href = "teacher.html";
}

// 페이지 로드 시 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
    const studentNameInput = document.getElementById("student-name");
    studentNameInput.addEventListener("keypress", (event) => handleEnter(event, "fetch-button"));

    const officerButton = document.getElementById("officer-button");
    officerButton.addEventListener("click", goToTeacherPage);
});
