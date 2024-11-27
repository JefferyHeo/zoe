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
            console.log("서버에서 받은 데이터:", data);

            const totalMileage = data.totalMileage || 0;
            document.getElementById("total-mileage").textContent = `총 마일리지: ${totalMileage}점`;
            document.getElementById("student-name-display").textContent = `학생 이름: ${data.studentName}`;

            const mileageLog = document.getElementById("mileage-log");
            mileageLog.innerHTML = ""; // 기존 내용 초기화

            if (Array.isArray(data.log) && data.log.length > 0) {
                data.log.forEach(entry => {
                    const date = entry.date ? entry.date : "날짜 없음"; // date가 없으면 기본값 사용
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
        .catch(error => {
            console.error("마일리지 조회 실패:", error);
            alert("마일리지 조회에 실패했습니다. 학생 이름을 확인하세요.");
        });
}

// 엔터 키 입력 시 조회 실행
function handleEnter(event) {
    if (event.key === "Enter") {
        fetchMileage(); // 엔터 키로 조회 실행
    }
}

// teacher.html로 이동
function goToTeacherPage() {
    window.location.href = "teacher.html";
}

// DOMContentLoaded 이벤트 핸들러
document.addEventListener("DOMContentLoaded", () => {
    // "학생 이름" 입력 필드에 엔터 키 이벤트 리스너 추가
    const studentNameInput = document.getElementById("student-name");
    studentNameInput.addEventListener("keypress", handleEnter);

    // "Officer" 버튼 클릭 시 이동
    const officerButton = document.getElementById("officer-button");
    officerButton.addEventListener("click", goToTeacherPage);
});
