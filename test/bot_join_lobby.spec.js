import { test, chromium } from '@playwright/test';
test.setTimeout(20000000);
test('nhiều người cùng join lobby', async () => {
    const lobby_id = '109561'; // Thay đổi thành ID phòng thực tế nếu cần
  const browser = await chromium.launch();
  const vietnameseNames = [
  "Ánh","Linh","Minh","An","Khang","Tuấn","Nam","Hoa","Mai","Lan",
  "Phúc","Long","Sơn","Hiếu","Quyên","Vy","Thảo","Nhi","Đức","Đạt",
  "Quang","Bảo","Hạnh","Ngọc","Tiến","Trinh","Phương","Hương","Giang","Tâm",
  "Khôi","Châu","Vân","Nga","Hà","Tú","Diệp","Thư","Liên","Kim",
  "Tuyết","Yến","Loan","Như","Phú","Cường","Trọng","Lợi","Thiện","Dũng"
];

const englishNames = [
  "Alice","Olivia","Emma","Sophia","Ava","Isabella","Mia","Amelia","Harper","Evelyn",
  "Liam","Noah","Oliver","Elijah","James","William","Benjamin","Lucas","Henry","Alexander",
  "Charlotte","Emily","Abigail","Elizabeth","Sofia","Ella","Scarlett","Grace","Chloe","Victoria",
  "Daniel","Michael","Matthew","Samuel","Joseph","David","Andrew","Thomas","Joshua","Christopher",
  "Natalie","Hannah","Lily","Zoe","Aria","Aurora","Hazel","Stella","Lucy","Violet"
];

const names = [...vietnameseNames, ...englishNames];

  // Tạo context và page cho từng người chơi
  const players = [];

for (const name of names) {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`http://localhost:3000/lobby/client/${lobby_id}`);
  await page.fill('input[name="input name"]', name);
  await page.click('button[name="btn enter lobby"]');

  players.push({ name, page });

  // 🌷 Nghỉ 1 giây rồi mới thêm người tiếp theo
  await new Promise(resolve => setTimeout(resolve, 100));
}


  // 🧚 Từ đây bạn có thể tương tác với từng player
  // Ví dụ: kiểm tra ai đã join thành công
  for (const p of players) {
  // ✨ Dẫn player này sang trang hiển thị danh sách
  await p.page.goto('http://localhost:3000/lobby/room', { waitUntil: 'networkidle' });

  // ⏳ Chờ phần tử danh sách player xuất hiện
  await p.page.waitForSelector('#player-list', { timeout: 5000 });

  console.log(`✅ ${p.name} đã vào phòng và thấy danh sách!`);
}

  await browser.close();
});
