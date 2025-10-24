# Prisma Schema 結構說明

這個專案使用了模組化的 Prisma schema 設計，將不同的 models 分散在多個檔案中，以提高可維護性。

## 📁 目錄結構

```
prisma/
├── schema.prisma          # 主要 schema 檔案（generator 和 datasource 配置）
├── models/                # 所有 model 定義
│   ├── User.prisma       # User model
│   ├── Post.prisma       # Post model (如果有的話)
│   └── ...               # 其他 models
└── seed.ts               # 資料庫種子檔案
```

## 🔄 工作流程

### 1. 定義 Model
在 `prisma/models/` 目錄下創建新的 `.prisma` 檔案，例如：

**prisma/models/User.prisma**
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. 合併 Models
執行合併腳本，將所有 models 自動合併到 `schema.prisma`：

```bash
npm run prisma:merge
```

這個腳本會：
- 讀取 `prisma/models/` 目錄下所有 `.prisma` 檔案
- 按檔名排序
- 自動合併到 `schema.prisma` 中
- 保留 generator 和 datasource 的原始配置

### 3. 生成 Prisma Client

```bash
npm run prisma:generate
```

這個指令會自動執行 `prisma:merge` 然後生成 Prisma Client。

### 4. 推送到資料庫

```bash
npm run prisma:push
```

這個指令會自動執行 `prisma:merge` 然後推送 schema 到資料庫。

### 5. 開啟 Prisma Studio

```bash
npm run prisma:studio
```

這個指令會自動執行 `prisma:merge` 然後開啟 Prisma Studio。

## ⚙️ 可用的腳本命令

| 命令 | 說明 |
|------|------|
| `npm run prisma:merge` | 合併所有 model 檔案到 schema.prisma |
| `npm run prisma:generate` | 合併 + 生成 Prisma Client |
| `npm run prisma:push` | 合併 + 推送到資料庫 |
| `npm run prisma:studio` | 合併 + 開啟 Prisma Studio |

## 📝 注意事項

1. **不要直接編輯 schema.prisma 中的 models**
   - 所有 model 定義應該放在 `prisma/models/` 目錄下
   - `schema.prisma` 中的 models 會在每次執行 `prisma:merge` 時被覆蓋

2. **在執行 Prisma 命令前記得合併**
   - 我們已經在 package.json 中設定好自動合併
   - 使用 `npm run prisma:*` 命令會自動處理合併

3. **Models 檔案命名**
   - 使用 PascalCase 命名，例如：`User.prisma`, `Post.prisma`
   - 檔案會按照字母順序合併

4. **版本控制**
   - 提交 `prisma/models/` 目錄下的所有檔案
   - 提交 `schema.prisma`（雖然它是自動生成的，但可以幫助其他人理解完整結構）

## 💡 優點

- ✅ **模組化**：每個 model 獨立管理，容易維護
- ✅ **可讀性**：大型專案中不會有一個巨大的 schema 檔案
- ✅ **團隊協作**：減少 merge conflict，不同人可以編輯不同的 model 檔案
- ✅ **組織性**：相關的 models 可以用檔案結構來組織
- ✅ **自動化**：透過腳本自動合併，不需要手動管理

## 🔄 開發流程範例

```bash
# 1. 建立或修改 model
vim prisma/models/User.prisma

# 2. 合併並推送到資料庫
npm run prisma:push

# 3. 生成 Prisma Client（如果是新 model）
npm run prisma:generate

# 4. 開始開發
npm run dev
```

