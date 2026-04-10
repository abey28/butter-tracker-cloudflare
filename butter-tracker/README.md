# 🧈 25KG奶油業績追蹤系統 - 雲端版

## 功能特色
- ✅ 可部署至 Cloudflare Pages（免費方案即可）
- ✅ 使用 Cloudflare KV 儲存共用資料（同仁更新後所有人即時看到）
- ✅ 業務員身份識別（選擇自己名字，進度更新會預先篩選）
- ✅ 自動儲存（3秒後自動同步至雲端）
- ✅ 離線備份（自動存 localStorage，雲端失敗不怕）
- ✅ 資料匯出（JSON 格式備份）
- ✅ 成交紀錄可刪除
- ✅ 備註可直接在「進度更新」頁面編輯

---

## 部署步驟

### 方法一：Cloudflare Pages（推薦，有雲端同步）

1. **建立 KV Namespace**
   - 登入 Cloudflare Dashboard
   - 進入「Workers & Pages」→「KV」
   - 點「Create a namespace」，名稱填 `BUTTER_KV`
   - 記下產生的 **Namespace ID**

2. **設定 wrangler.toml**
   ```toml
   # 將 wrangler.toml 中的 YOUR_KV_NAMESPACE_ID 換成上面的 ID
   id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

3. **上傳到 GitHub**
   - 建立一個 GitHub repository
   - 把整個資料夾（`public/`、`functions/`、`wrangler.toml`）推上去

4. **連結 Cloudflare Pages**
   - 進入「Workers & Pages」→「Create application」→「Pages」
   - 連結你的 GitHub repo
   - Build settings：
     - Framework preset: `None`
     - Build command: （空白）
     - Build output directory: `public`

5. **綁定 KV**
   - Pages 部署完成後，進入設定 → 「Functions」→「KV namespace bindings」
   - 新增綁定：Variable name = `BUTTER_KV`，選擇剛才建立的 namespace

6. **重新部署**
   - 在 Pages 設定中點「Retry deployment」

---

### 方法二：純靜態（無雲端同步，僅本機儲存）

若不需要多人共享，直接把 `public/index.html` 上傳到任意靜態網站服務即可。
資料會自動儲存在各自瀏覽器的 localStorage。

---

## 資料夾結構

```
butter-tracker/
├── public/
│   └── index.html          # 主程式（純 HTML，無需 build）
├── functions/
│   └── api/
│       └── data.js         # Cloudflare Pages Function（KV API）
├── wrangler.toml           # Cloudflare 設定
└── README.md
```

---

## 同仁使用說明

1. 開啟網址後，先在上方「您的身份」選擇自己的名字
2. 切換到「🔄 進度更新」頁籤，會自動篩選你的客戶
3. 更新階段、風險、進展後，系統會在 3 秒後自動儲存至雲端
4. 也可點右上角「💾 儲存雲端」立即儲存
5. 新增客戶或成交紀錄後記得儲存

---

## 注意事項

- Cloudflare Pages + KV 免費方案限制：每日 10 萬次讀寫，業績追蹤絕對夠用
- 若多人同時編輯，以最後儲存者為準（Last Write Wins）
- 建議每週定期點「📤 匯出資料」備份一次 JSON 檔
