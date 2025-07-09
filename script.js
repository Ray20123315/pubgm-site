// 清理字串用
function clean(value) {
  if (!value) return "";
  return value.toString()
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ");
}

// 根據欄位名模糊比對
function findKey(obj, keyword) {
  const keys = Object.keys(obj);
  for (let key of keys) {
    if (key.replace(/\s/g, '').includes(keyword.replace(/\s/g, ''))) {
      return key;
    }
  }
  return null;
}

// 轉換時間格式，並且清晨-半夜全都有就當全天
function parseTimeText(str) {
  if (!str) return [];
  const raw = str.replace(/^"+|"+$/g, "").trim();
  if (!raw) return [];

  const allTimes = ["清晨", "上午", "中午", "下午", "晚上", "半夜"];
  let parts = raw.split(/[,、\s]+/).filter(p => p && p !== "，");
  const unique = [...new Set(parts)];

  if (unique.includes("不玩")) return ["不玩"];
  if (unique.includes("全天") || allTimes.every(t => unique.includes(t))) return ["全天"];

  return unique;
}

// 顯示隊友資料
function displayTeammates(data) {
  const container = document.getElementById("teammate-list");
  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = "<p>目前沒有推薦的隊友。</p>";
    return;
  }

  const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

  data.forEach(item => {
    const idKey = findKey(item, "隊友ID") || findKey(item, "隊友 ID");
    const uidKey = findKey(item, "UID");
    const idVal = idKey ? clean(item[idKey]) : "";
    const uidVal = uidKey ? clean(item[uidKey]) : "";

    // 顯示ID格式：有名字跟UID顯示完整，沒名字只顯示UID
    const displayID = idVal && uidVal
      ? `${idVal}（UID: ${uidVal}）`
      : idVal
        ? idVal
        : uidVal
          ? `UID: ${uidVal}`
          : "未提供";

    const roleKey = findKey(item, "擅長角色");
    const techKey = findKey(item, "技術類型");
    const noteKey = findKey(item, "備註") || findKey(item, "想補充");
    const satisfactionKey = findKey(item, "滿意度");
    const likeKey = findKey(item, "喜愛度");

    // 讀取滿意度與喜愛度，轉數字
    const satisfactionVal = satisfactionKey ? Number(clean(item[satisfactionKey])) : NaN;
    const likeVal = likeKey ? Number(clean(item[likeKey])) : NaN;

    // 計算綜合分（兩者皆為數字時才計算，否則顯示無）
    let compositeScore = "無";
    if (!isNaN(satisfactionVal) && !isNaN(likeVal)) {
      compositeScore = ((satisfactionVal + likeVal) / 2).toFixed(2);
    }

    // 組出出沒時間字串
    let timesText = "";
    for (let i = 0; i < 7; i++) {
      const dayKey = findKey(item, `星期${weekDays[i]}`);
      const raw = dayKey ? clean(item[dayKey]) : "";
      const parsed = parseTimeText(raw);

      // 若有不玩就直接顯示不玩，忽略其他時間
      if (parsed.includes("不玩")) {
        timesText += `　${weekDays[i]}：不玩<br>`;
      } else if (parsed.length === 1) {
        timesText += `　${weekDays[i]}：${parsed[0]}<br>`;
      } else if (parsed.length > 1) {
        timesText += `　${weekDays[i]}：${parsed.join(", ")}<br>`;
      } else {
        timesText += `　${weekDays[i]}：無資料<br>`;
      }
    }

    const card = document.createElement("div");
    card.className = "teammate-card";
    card.innerHTML = `
      <h3>🆔 ${displayID}</h3>
      <p>🎯 擅長角色：${roleKey ? clean(item[roleKey]) : "無"}</p>
      <p>📊 技術評價：${techKey ? clean(item[techKey]) : "無"}</p>
      <p>🕐 出沒時間：<br>${timesText}</p>
      <p>💬 備註：${noteKey ? clean(item[noteKey]) : "無"}</p>
      <p>⭐ 滿意度：${satisfactionKey ? clean(item[satisfactionKey]) : "無"}</p>
      <p>💖 喜愛度：${likeKey ? clean(item[likeKey]) : "無"}</p>
      <p>📈 綜合分：${compositeScore}</p>
    `;
    container.appendChild(card);
  });
}

// 你的試算表 CSV 連結
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4C-YNnRgX3N71kURyPYn0K6Gt34uLFPm5DjiWzHf9DfKDzE3LIoEm2D8SqZoyrXycU4cIDK7qlgLd/pub?output=csv";

// 用 PapaParse 下載並解析 CSV
Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function (results) {
    displayTeammates(results.data);
  },
  error: function (err) {
    document.getElementById("teammate-list").innerHTML = "<p>讀取資料失敗，請稍後再試。</p>";
    console.error(err);
  }
});
