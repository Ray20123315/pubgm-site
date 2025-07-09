// 載入 Google 試算表公開 CSV 連結
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4C-YNnRgX3N71kURyPYn0K6Gt34uLFPm5DjiWzHf9DfKDzE3LIoEm2D8SqZoyrXycU4cIDK7qlgLd/pub?output=csv";

// 清理字串前後多餘雙引號及換行，並修剪空白
function clean(value) {
  if (!value) return "";
  return value.replace(/^"+|"+$/g, "").replace(/\n/g, " / ").trim();
}

// 顯示好友卡片
function displayTeammates(data) {
  const container = document.getElementById("teammate-list");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>目前沒有推薦的隊友。</p>";
    return;
  }

  const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

  data.forEach(item => {
    let timesText = "";
    for (let i = 0; i < 7; i++) {
      const key = `平常遊玩時間(若當天不玩請填寫不玩) [星期${weekDays[i]}]`;
      const val = clean(item[key]);
      if (val && !val.includes("不玩")) {
        timesText += `　${weekDays[i]}：${val}<br>`;
      }
    }

    const card = document.createElement("div");
    card.className = "teammate-card";
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

// 用 PapaParse 解析 CSV，須先在 index.html 加入以下 script 標籤：
// <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

fetch(sheetURL)
  .then(res => res.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        displayTeammates(results.data);
      },
      error: function(err) {
        console.error(err);
        document.getElementById("teammate-list").innerHTML = "<p>資料解析錯誤，請稍後再試。</p>";
      }
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById("teammate-list").innerHTML = "<p>載入資料失敗，請稍後再試。</p>";
  });
