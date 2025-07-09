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

    const displayID = idVal && uidVal
      ? `${idVal} (UID: ${uidVal})`
      : idVal || (uidVal ? `UID: ${uidVal}` : "未提供");

    const roleKey = findKey(item, "擅長角色");
    const techKey = findKey(item, "技術類型");
    const noteKey = findKey(item, "備註") || findKey(item, "想補充");
    const satisfactionKey = findKey(item, "滿意度");
    const likeKey = findKey(item, "喜愛度");

    let timesText = "";
    for (let i = 0; i < 7; i++) {
      const dayKey = findKey(item, `星期${weekDays[i]}`);
      const raw = dayKey ? clean(item[dayKey]) : "";
      const parsed = parseTimeText(raw);

      if (parsed.length === 1) {
        timesText += `　${weekDays[i]}：${parsed[0]}<br>`;
      } else if (parsed.length > 1) {
        timesText += `　${weekDays[i]}：${parsed.join(", ")}<br>`;
      }
    }

    let html = `<h3>🆔 ${displayID}</h3>`;
    if (roleKey && clean(item[roleKey])) html += `<p>🎯 擅長角色：${clean(item[roleKey])}</p>`;
    if (techKey && clean(item[techKey])) html += `<p>📊 技術評價：${clean(item[techKey])}</p>`;
    html += `<p>🕐 出沒時間：<br>${timesText}</p>`;
    if (noteKey && clean(item[noteKey])) html += `<p>💬 備註：${clean(item[noteKey])}</p>`;
    if (satisfactionKey && clean(item[satisfactionKey])) html += `<p>⭐ 滿意度：${clean(item[satisfactionKey])}</p>`;
    if (likeKey && clean(item[likeKey])) html += `<p>💖 喜愛度：${clean(item[likeKey])}</p>`;

    const card = document.createElement("div");
    card.className = "teammate-card";
    card.innerHTML = html;
    container.appendChild(card);
  });
}
