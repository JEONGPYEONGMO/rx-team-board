// Firebase 멤버 목록 직접 업데이트 스크립트
// 실행: node update-members.js

const API_KEY = "AIzaSyALoJTOi18FdPCJnhVL4jQ3E9Fvmvqv6EM";
const DB_URL  = "https://rx-team-board-default-rtdb.asia-southeast1.firebasedatabase.app";

const MEMBERS = [
  { id: "m1",  name: "이강헌", rank: "대표" },
  { id: "m2",  name: "이성기", rank: "이사" },
  { id: "m3",  name: "황정하", rank: "이사" },
  { id: "m4",  name: "김병훈", rank: "팀장" },
  { id: "m5",  name: "이소윤", rank: "팀장" },
  { id: "m6",  name: "최순",   rank: "고문" },
  { id: "m7",  name: "정평모", rank: "책임" },
  { id: "m15", name: "배문기", rank: "과장" },
  { id: "m8",  name: "고동국", rank: "선임" },
  { id: "m9",  name: "손주현", rank: "선임" },
  { id: "m10", name: "오서진", rank: "선임" },
  { id: "m11", name: "이대윤", rank: "선임" },
  { id: "m12", name: "이종원", rank: "선임" },
  { id: "m13", name: "정세진", rank: "선임" },
  { id: "m14", name: "조재훈", rank: "선임" },
];

async function main() {
  // 1. 익명 로그인으로 ID 토큰 발급
  console.log("1. 익명 인증 중...");
  const authRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ returnSecureToken: true }),
    }
  );

  if (!authRes.ok) {
    const err = await authRes.json();
    console.error("인증 실패:", err.error?.message || JSON.stringify(err));
    console.error("→ Firebase Console에서 익명 인증(Anonymous) 이 활성화되어 있는지 확인하세요.");
    process.exit(1);
  }

  const { idToken } = await authRes.json();
  console.log("   인증 완료");

  // 2. 멤버 데이터 구성
  const obj = {};
  MEMBERS.forEach((m, i) => { obj[m.id] = { ...m, order: i }; });

  // 3. Firebase Realtime DB /members 에 PUT
  console.log("2. Firebase /members 업데이트 중...");
  const dbRes = await fetch(`${DB_URL}/members.json?auth=${idToken}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });

  if (!dbRes.ok) {
    const err = await dbRes.json();
    console.error("DB 쓰기 실패:", err.error || JSON.stringify(err));
    process.exit(1);
  }

  const result = await dbRes.json();
  console.log(`   완료! ${Object.keys(result).length}명 업데이트됨`);
  MEMBERS.forEach((m) => console.log(`   [${m.rank}] ${m.name}`));
}

main().catch((e) => { console.error("오류:", e.message); process.exit(1); });
