
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4C-YNnRgX3N71kURyPYn0K6Gt34uLFPm5DjiWzHf9DfKDzE3LIoEm2D8SqZoyrXycU4cIDK7qlgLd/pub?output=csv";

function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  const rows = lines.map(line => {
    const cells = line.split(',');
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (cells[i] || "").trim());
    return obj;
  });
  return rows;
}

function cleanValue(value) {
  if (!value) return "";
  return value.replace(/^"+|"+$/g, '').replace(/\n/g, ' / ').trim();
}

function displayTeammates(data) {
  const container = document.getElementById('teammate-list');
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p>目前沒有推薦的隊友。</p>';
    return;
  }

  const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

  data.forEach(item => {
    let timesText = '';
    for (let i = 0; i < 7; i++) {
      const key = `平常遊玩時間(若當天不玩請填寫不玩) [星期${weekDays[i]}]`;
      const val = cleanValue(item[key]);
      if (val && !val.includes("不玩")) {
        timesText += `　${weekDays[i]}：${val}<br>`;
      }
    }

    const card = document.createElement('div');
    card.className = 'teammate-card';
    card.innerHTML = `
      <h3>🆔 ${cleanValue(item["隊友 ID"])}（UID: ${cleanValue(item["隊友UID"])})</h3>
      <p>🎯 擅長角色：${cleanValue(item["擅長扮演角色(擅長角色或定位)"])}</p>
      <p>📊 技術評價：${cleanValue(item["技術類型(自評)(請勿罵人)"])}</p>
      <p>🕐 出沒時間：<br>${timesText || "無資料"}</p>
      <p>💬 備註：${cleanValue(item["想補充的內容"]) || "無"}</p>
      <p>⭐ 滿意度：${cleanValue(item["滿意度"]) || "無"}</p>
      <p>💖 喜愛度：${cleanValue(item["喜愛度"]) || "無"}</p>
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
    container.innerHTML = '<p>載入資料失敗，請稍後再試。</p>';
    console.error(err);
  });
