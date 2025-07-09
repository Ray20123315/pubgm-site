function displayTeammates(data) {
  const container = document.getElementById("teammate-list");
  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = "<p>目前沒有推薦的隊友。</p>";
    return;
  }

  const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

  data.forEach(item => {
    const idKey = findKey(item, "隊友ID") || findKey(item, "隊友 ID") || findKey(item, "ID");
    const uidKey = findKey(item, "UID");

    const idVal = idKey ? clean(item[idKey]) : "";
    const uidVal = uidKey ? clean(item[uidKey]) : "";

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

    const satisfaction = satisfactionKey ? Number(clean(item[satisfactionKey])) : NaN;
    const like = likeKey ? Number(clean(item[likeKey])) : NaN;
    console.log("滿意度", satisfaction, "喜愛度", like);
    let averageScore = null;
    if (!isNaN(satisfaction) && !isNaN(like)) {
      averageScore = ((satisfaction + like) / 2).toFixed(2);
    }

    let timesText = "";
    for (let i = 0; i < 7; i++) {
      const dayKey = findKey(item, `星期${weekDays[i]}`);
      const raw = dayKey ? clean(item[dayKey]) : "";
      const parsed = parseTimeText(raw);

      if (parsed.length === 1) {
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
      ${averageScore !== null ? `<p>🌟 綜合分：${averageScore}</p>` : ""}
    `;
    container.appendChild(card);
  });
}
