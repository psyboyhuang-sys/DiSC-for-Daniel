// ════════════════════════════════════
//  後台連線（Google Apps Script）
// ════════════════════════════════════

// 每次使用唯一網址載入 config.js，避免 GitHub Pages/CDN 沿用舊快取
const configReady = new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = `config.js?v=${Date.now()}`;
  script.onload = resolve;
  script.onerror = () => reject(new Error('設定檔載入失敗，請重新整理頁面'));
  document.head.appendChild(script);
});

async function callApi(payload) {
  await configReady;
  if (typeof API_URL === 'undefined' || !API_URL || API_URL.includes('請貼上')) {
    throw new Error('後台網址尚未設定，請洽講師');
  }

  // 不設 Content-Type（預設 text/plain），瀏覽器就不會先送 CORS 預檢，Apps Script 才能正常回應
  let res;
  try {
    res = await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
  } catch (err) {
    throw new Error('無法連線到後台，請檢查網路後再試一次');
  }
  if (!res.ok) throw new Error(`後台連線失敗（HTTP ${res.status}）`);

  try {
    return await res.json();
  } catch (err) {
    throw new Error('後台回應格式錯誤，請洽講師確認部署設定');
  }
}
