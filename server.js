const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// 정적 파일 제공
app.use(express.static('public'));

// JSON 요청 본문 파싱
app.use(express.json());

// 임시 데이터베이스
let students = [];
let mileageLog = [];

let mileageCategories = [
    { name: "자습1시간30분", points: 20 },
    { name: "Test100점", points: 20 },
    { name: "StudyPlanner", points: 10 },
    { name: "주말 공부 2시간당", points: 10 },
    { name: "Daily Quiz 정답", points: 5 },
    { name: "지각 5분당", points: -3 },
    { name: "결석(이유없이)", points: -50 },
    { name: "Test 0점", points: -10 },
    { name: "숙제안해왔을시", points: -10 }
];

// 학생 등록
app.post('/api/register-student', (req, res) => {
    const { name } = req.body;
    const studentId = students.length + 1;
    const newStudent = { id: studentId, name, mileage: 0 };
    students.push(newStudent);
    res.json(newStudent);
});

// 마일리지 추가
app.post('/api/add-mileage', (req, res) => {
    const { studentId, mileageType, points, date } = req.body; // 클라이언트에서 날짜 받아오기
    const student = students.find(s => s.id === parseInt(studentId));

    if (!student) {
        return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
    }

    // 날짜가 유효한지 확인
    const isValidDate = (date) => {
        const parsedDate = new Date(date);
        return parsedDate instanceof Date && !isNaN(parsedDate); // 유효한 날짜인지 확인
    };

    if (!date || !isValidDate(date)) {
        return res.status(400).json({ message: '유효한 날짜를 입력하세요.' });
    }

    // 클라이언트에서 전달된 날짜를 그대로 사용
    mileageLog.push({ studentId: parseInt(studentId), mileageType, points, date });
    console.log('마일리지가 추가되었습니다:', { studentId, mileageType, points, date });
    res.json({ message: '마일리지 부여 완료', log: { studentId, mileageType, points, date } });
});


// 학생 목록 조회
app.get('/api/students', (req, res) => {
    res.json(students);
});

// 이름 기반 학생 마일리지 조회
app.get('/api/mileage/:studentName', (req, res) => {
    const studentName = req.params.studentName;
    const student = students.find(s => s.name === studentName);

    if (!student) {
        return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
    }

    const studentMileageLog = mileageLog.filter(log => log.studentId === student.id);
    const totalMileage = studentMileageLog.reduce((sum, entry) => sum + entry.points, 0);

    res.json({
        studentName: student.name,
        totalMileage,
        log: studentMileageLog
    });
});

// 마일리지 카테고리 조회
app.get('/api/mileage-categories', (req, res) => {
    res.json(mileageCategories);
});

// 마일리지 카테고리 추가
app.post('/api/add-mileage-category', (req, res) => {
    const { name, points } = req.body;
    if (!name || isNaN(points)) {
        return res.status(400).json({ message: '올바른 카테고리 이름과 포인트를 입력하세요.' });
    }

    const newCategory = { name, points };
    mileageCategories.push(newCategory);
    res.json({ message: '마일리지 카테고리 추가 완료', category: newCategory });
});

// 학생 삭제
app.delete('/api/delete-student/:studentId', (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex !== -1) {
        students.splice(studentIndex, 1);
        mileageLog = mileageLog.filter(log => log.studentId !== studentId);
        res.json({ message: '학생이 삭제되었습니다.' });
    } else {
        res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
