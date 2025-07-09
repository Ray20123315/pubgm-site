
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4C-YNnRgX3N71kURyPYn0K6Gt34uLFPm5DjiWzHf9DfKDzE3LIoEm2D8SqZoyrXycU4cIDK7qlgLd/pub?output=csv";

fetch(sheetURL)
  .then(res => res.text())
  .then(csv => {
    const lines = csv.split('\n').slice(1); // Skip header
    const container = document.getElementById("teammate-list");
    container.innerHTML = "";

    lines.forEach(line => {
      const fields = line.split(',');
      if (fields.length < 14) return;

      const [_, id, uid, role, ...rest] = fields;
      const times = rest.slice(0, 7);
      const skill = rest[7];
      const note = rest[8];
      const rate = rest[9];
      const like = rest[10];

      let timeDisplay = "";
      const week = ["一", "二", "三", "四", "五", "六", "日"];
      for (let i = 0; i < 7; i++) {
        const t = times[i].trim();
        if (t && !t.includes("不玩")) {
          timeDisplay += `　${week[i]}：${t}\n`;
        }
      }

      const card = document.createElement("div");
      card.className = "teammate-card";
      card.innerHTML = `
        <h2>🆔 ${id}（UID: ${uid}）</h2>
        <p>🎯 擅長角色：${role}</p>
        <p>📊 技術評價：${skill}</p>
        <p>🕐 出沒時間：\n${timeDisplay || "無資料"}</p>
        <p>💬 備註：${note}</p>
        <p>⭐ 滿意度：${rate}</p>
        <p>💖 喜愛度：${like}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => {
    document.getElementById("teammate-list").innerText = "載入失敗：" + err;
  });
