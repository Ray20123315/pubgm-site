
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4C-YNnRgX3N71kURyPYn0K6Gt34uLFPm5DjiWzHf9DfKDzE3LIoEm2D8SqZoyrXycU4cIDK7qlgLd/pub?output=csv";

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines.shift().split(',');
  const rows = lines.map(line => {
    const cells = line.split(',');
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (cells[i] || "").trim());
    return obj;
  });
  return rows;
}

function cleanValue(value, type) {
  const timeWords = ["上午", "中午", "下午", "晚上", "清晨", "半夜", "全天", "NO", "不玩"];
  const satisfactionWords = ["非常滿意", "滿意", "普通", "不太滿意", "不滿意", "1", "2", "3", "4", "5"];
  const loveWords = ["1", "2", "3", "4", "5"];

  if (type === "技術評價") {
    // 避免時間字眼跑進技術評價
    if (timeWords.some(w => value.includes(w))) return "";
  }
  if (type === "滿意度") {
    if (timeWords.some(w => value.includes(w))) return "";
  }
  if (type === "喜愛度") {
    if (timeWords.some(w => value.includes(w))) return "";
  }
  return value.replace(/^"+|"+$/g, '').trim();
}

function displayTeammates(data) {
  const container = document.getElementById('teammate-list');
  container.innerHTML = '';

  if(data.length === 0) {
    container.innerHTML = '<p>目前沒有推薦的隊友。</p>';
    return;
  }

  const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

  data.forEach(item => {
    let timesText = '';
    for(let i=0; i<7; i++) {
      const dayKey = `平常遊玩時間(若當天不玩請填寫不玩) [星期${weekDays[i]}]`;
      let timeVal = item[dayKey];
      if(timeVal && !timeVal.includes("不玩")) {
        timesText += `　${weekDays[i]}：${timeVal}\n`;
      }
    }

    const card = document.createElement('div');
    card.className = 'teammate-card';
    card.innerHTML = `
      <h3>🆔 ${item["隊友 ID"] || "未知"}（UID: ${item["隊友UID"] || "未知"}）</h3>
      <p>🎯 擅長角色：${cleanValue(item["擅長扮演角色(擅長角色或定位)"], "角色") || "無"}</p>
      <p>📊 技術評價：${cleanValue(item["技術類型(自評)(請勿罵人)"], "技術評價") || "無"}</p>
      <p>🕐 出沒時間：<br>${timesText || "無資料"}</p>
      <p>💬 備註：${cleanValue(item["想補充的內容"], "備註") || "無"}</p>
      <p>⭐ 滿意度：${cleanValue(item["滿意度"], "滿意度") || "無"}</p>
      <p>💖 喜愛度：${cleanValue(item["喜愛度"], "喜愛度") || "無"}</p>
    `;
    container.appendChild(card);
  });
}

fetch(sheetURL)
  .then(res => res.text())
  .then(csv => {
    const data = parseCSV(csv);
    displayTeammates(data);
  })
  .catch(err => {
    const container = document.getElementById('teammate-list');
    container.innerHTML = `<p>載入資料失敗，請稍後再試。</p>`;
    console.error(err);
  });
