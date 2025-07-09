const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4C-YNnRgX3N71kURyPYn0K6Gt34uLFPm5DjiWzHf9DfKDzE3LIoEm2D8SqZoyrXycU4cIDK7qlgLd/pub?output=csv";

function clean(value) {
  if (!value) return "";
  return value.toString().trim().replace(/^"+|"+$/g, "").replace(/\n/g, " / ");
}

function findKey(obj, keyword) {
  const keys = Object.keys(obj);
  for (let key of keys) {
    if (key.replace(/\s/g, '').includes(keyword.replace(/\s/g, ''))) {
      return key;
    }
  }
  return null;
}

function displayTeammates(data) {
  const container = document.getElementById("teammate-list");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>目前沒有推薦的隊友。</p>";
    return;
  }

  const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

  data.forEach(item => {
    const idKey = findKey(item, "隊友ID") || findKey(item, "隊友 ID");
    const uidKey = findKey(item, "隊友UID") || findKey(item, "隊友 UID");
    const roleKey = findKey(item, "擅長角色") || findKey(item, "擅長扮演角色");
    const techKey = findKey(item, "技術類型") || findKey(item, "技術類型(自評)");
    const noteKey = findKey(item, "想補充") || findKey(item, "備註");
    const satisfactionKey = findKey(item, "滿意度");
    const likeKey = findKey(item, "喜愛度");

    const id = idKey ? clean(item[idKey]) : "";
    const uid = uidKey ? clean(item[uidKey]) : "";
    const displayID = id ? id : `(UID: ${uid})`;

    let timesText = "";
    for (let i = 0; i < 7; i++) {
      const dayKey1 = `平常遊玩時間(若當天不玩請填寫不玩) [星期${weekDays[i]}]`;
      const dayKey2 = findKey(item, `星期${weekDays[i]}`);
      const key = item.hasOwnProperty(dayKey1) ? dayKey1 : (dayKey2 || "");
      const val = key ? clean(item[key]) : "";
      if (val && !val.includes("不玩")) {
        timesText += `　${weekDays[i]}：${val}<br>`;
      }
    }

    const card = document.createElement("div");
    card.className = "teammate-card";
    card.innerHTML = `
      <h3>🆔 ${displayID}</h3>
      <p>🎯 擅長角色：${roleKey ? clean(item[roleKey]) : "無"}</p>
      <p>📊 技術評價：${techKey ? clean(item[techKey]) : "無"}</p>
      <p>🕐 出沒時間：<br>${timesText || "無資料"}</p>
      <p>💬 備註：${noteKey ? clean(item[noteKey]) : "無"}</p>
      <p>⭐ 滿意度：${satisfactionKey ? clean(item[satisfactionKey]) : "無"}</p>
      <p>💖 喜愛度：${likeKey ? clean(item[likeKey]) : "無"}</p>
    `;
    container.appendChild(card);
  });
}

Papa.parse(sheetURL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    console.log("欄位名稱:", Object.keys(results.data[0]));
    console.log("第一筆資料:", results.data[0]);
    displayTeammates(results.data);
  },
  error: function(err) {
    console.error(err);
    document.getElementById("teammate-list").innerHTML = "<p>資料解析錯誤，請稍後再試。</p>";
  }
});
