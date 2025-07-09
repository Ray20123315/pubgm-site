const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4C-YNnRgX3N71kURyPYn0K6Gt34uLFPm5DjiWzHf9DfKDzE3LIoEm2D8SqZoyrXycU4cIDK7qlgLd/pub?output=csv";

function parseCSV(text) {
  const rows = [];
  let row = [], insideQuote = false, field = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && insideQuote && nextChar === '"') {
      field += '"';
      i++; // skip next quote
    } else if (char === '"') {
      insideQuote = !insideQuote;
    } else if (char === ',' && !insideQuote) {
      row.push(field.trim());
      field = '';
    } else if ((char === '\n' || char === '\r') && !insideQuote) {
      if (field || row.length > 0) row.push(field.trim());
      if (row.length > 1) rows.push(row);
      row = [];
      field = '';
      if (char === '\r' && nextChar === '\n') i++;
    } else {
      field += char;
    }
  }
  if (field) row.push(field.trim());
  if (row.length > 1) rows.push(row);
  return rows;
}

function clean(value) {
  return (value || '').replace(/^"+|"+$/g, '').replace(/\n/g, ' / ').trim();
}

function displayTeammates(rows) {
  const container = document.getElementById('teammate-list');
  container.innerHTML = '';

  const header = rows[0];
  const data = rows.slice(1).map(row => {
    const obj = {};
    header.forEach((key, i) => {
      obj[key.trim()] = clean(row[i] || '');
    });
    return obj;
  });

  const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

  data.forEach(item => {
    let timesText = '';
    for (let i = 0; i < 7; i++) {
      const key = `平常遊玩時間(若當天不玩請填寫不玩) [星期${weekDays[i]}]`;
      const val = item[key];
      if (val && !val.includes("不玩")) {
        timesText += `　${weekDays[i]}：${val}<br>`;
      }
    }

    const card = document.createElement('div');
    card.className = 'teammate-card';
    card.innerHTML = `
      <h3>🆔 ${clean(item["隊友 ID"])}（UID: ${clean(item["隊友UID"])})</h3>
      <p>🎯 擅長角色：${clean(item["擅長扮演角色(擅長角色或定位)"])}</p>
      <p>📊 技術評價：${clean(item["技術類型(自評)(請勿罵人)"])}</p>
      <p>🕐 出沒時間：<br>${timesText || "無資料"}</p>
      <p>💬 備註：${clean(item["想補充的內容"]) || "無"}</p>
      <p>⭐ 滿意度：${clean(item["滿意度"]) || "無"}</p>
      <p>💖 喜愛度：${clean(item["喜愛度"]) || "無"}</p>
    `;
    container.appendChild(card);
  });
}

fetch(sheetURL)
  .then(res => res.text())
  .then(csv => {
    const parsed = parseCSV(csv);
    displayTeammates(parsed);
  })
  .catch(err => {
    const container = document.getElementById('teammate-list');
    container.innerHTML = '<p>載入資料失敗，請稍後再試。</p>';
    console.error(err);
  });
