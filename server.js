const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000; // 반드시 process.env.PORT를 사용하세요.

app.get('/', (req, res) => {
    res.send('Hello, Heroku!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// 정적 파일 제공 (HTML, CSS, JS)
app.use(express.static('public'));

// JSON 요청 본문을 파싱
app.use(express.json());

// 학생 데이터와 마일리지 점수를 저장할 임시 데이터베이스
let students = [];
let mileageLog = [];

let mileageCategories = [ // 기본 마일리지 카테고리
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

// 학생 등록 API
app.post('/api/register-student', (req, res) => {
    const { name } = req.body;
    const studentId = students.length + 1; // 단순히 ID를 증가시키는 방식
    const newStudent = { id: studentId, name, mileage: 0 };
    students.push(newStudent);
    console.log('학생이 등록되었습니다:', newStudent);
    res.json(newStudent);
});


// 마일리지 추가 API
app.post('/api/add-mileage', (req, res) => {
    const { studentId, mileageType, points } = req.body;
    const student = students.find(s => s.id === parseInt(studentId));
    if (student) {
        const date = new Date().toISOString().split('T')[0]; // 날짜를 YYYY-MM-DD 형식으로 저장
        mileageLog.push({ studentId: parseInt(studentId), mileageType, points, date });
        console.log('마일리지가 추가되었습니다:', { studentId, mileageType, points, date }); // 로그로 확인
        res.json({ message: '마일리지 부여 완료' });
    } else {
        res.status(404).json({ message: '학생을 찾을 수 없습니다' });
    }
});


// 학생 목록 조회 API
app.get('/api/students', (req, res) => {
    res.json(students);
});
// 이름 기반 학생 마일리지 조회 API
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

// 학생 마일리지 조회 API
app.get('/api/mileage/:studentId', (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const studentMileageLog = mileageLog.filter(log => log.studentId === studentId);
    res.json(studentMileageLog);
});

// 학생의 마일리지 내역과 합계를 반환하는 API
app.get('/api/mileage/:studentId', (req, res) => {
    console.log('API 호출됨');
    const studentId = parseInt(req.params.studentId);
    console.log(`요청된 학생 ID: ${studentId}`);

    const studentMileageLog = mileageLog.filter(log => log.studentId === studentId);
    console.log('필터링된 마일리지 로그:', studentMileageLog);

    const totalMileage = studentMileageLog.reduce((sum, entry) => sum + entry.points, 0);
    console.log(`총 마일리지: ${totalMileage}`);

    res.json({
        totalMileage,
        log: studentMileageLog
    });
});

app.post('/api/add-mileage', (req, res) => {
    const { studentId, mileageType, points } = req.body;
    const student = students.find(s => s.id === parseInt(studentId));
    if (student) {
        const date = new Date().toISOString().split('T')[0]; // 날짜 형식 (YYYY-MM-DD)
        mileageLog.push({ studentId: parseInt(studentId), mileageType, points, date });
        console.log('마일리지가 추가되었습니다:', { studentId, mileageType, points, date });
        res.json({ message: '마일리지 부여 완료' });
    } else {
        res.status(404).json({ message: '학생을 찾을 수 없습니다' });
    }
});


// 학생 삭제 API
app.delete('/api/delete-student/:studentId', (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex !== -1) {
        students.splice(studentIndex, 1); // 학생 목록에서 삭제
        // 관련된 마일리지 로그 삭제 (선택 사항)
        mileageLog = mileageLog.filter(log => log.studentId !== studentId);

        res.json({ message: '학생이 삭제되었습니다.' });
    } else {
        res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
    }
});


// 마일리지 카테고리 추가 API
app.post('/api/add-mileage-category', (req, res) => {
    const { name, points } = req.body;
    if (!name || isNaN(points)) {
        return res.status(400).json({ message: '올바른 카테고리 이름과 포인트를 입력하세요.' });
    }

    const newCategory = { name, points };
    mileageCategories.push(newCategory);
    res.json({ message: '마일리지 카테고리 추가 완료', category: newCategory });
});

// 마일리지 카테고리 목록 조회 API
app.get('/api/mileage-categories', (req, res) => {
    res.json(mileageCategories);
});
