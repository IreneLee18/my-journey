# 圖片上傳系統使用說明

## 📐 架構設計

這個圖片上傳系統採用資深工程師的最佳實踐：

### 1. **分離關注點**
- `PostImage` model：獨立的圖片 metadata 儲存
- 檔案系統：實際圖片檔案儲存在 `public/uploads/`
- 關聯關係：一對多（Post → PostImage）

### 2. **安全性**
- ✅ 檔案類型驗證（僅允許 JPEG、PNG、WebP、GIF）
- ✅ 檔案大小限制（5MB）
- ✅ 安全檔名生成（UUID）
- ✅ 路徑遍歷保護

### 3. **可維護性**
- 按日期組織檔案結構（`uploads/2024/10/`）
- 完整的 metadata 記錄
- 支援排序和批次操作

## 📊 資料庫結構

```prisma
model Post {
  id          String      @id @default(uuid())
  title       String
  publishDate DateTime    @default(now())
  images      PostImage[] // 一對多關係
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model PostImage {
  id        String   @id @default(uuid())
  postId    String
  filename  String   // 原始檔名（用於顯示）
  path      String   // 存儲路徑（相對於 public/）
  url       String   // 前端訪問 URL
  size      Int      // 檔案大小（bytes）
  mimeType  String   // MIME type
  order     Int      // 排序順序
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
}
```

## 🚀 使用方式

### 前端上傳圖片

```typescript
import { useUploadImages } from '@/server/upload/hooks';

function MyComponent() {
  const uploadImages = useUploadImages();

  const handleUpload = async (files: File[]) => {
    try {
      const result = await uploadImages.mutateAsync(files);
      console.log('上傳成功:', result.data.images);
      // result.data.images 包含：
      // [
      //   {
      //     filename: "原始檔名.jpg",
      //     path: "uploads/2024/10/uuid.jpg",
      //     url: "/uploads/2024/10/uuid.jpg",
      //     size: 123456,
      //     mimeType: "image/jpeg"
      //   }
      // ]
    } catch (error) {
      console.error('上傳失敗:', error);
    }
  };

  return (
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => {
        const files = Array.from(e.target.files || []);
        handleUpload(files);
      }}
    />
  );
}
```

### 建立文章並關聯圖片

```typescript
// 1. 先上傳圖片
const uploadResult = await uploadImages.mutateAsync(files);

// 2. 建立文章，並將圖片資訊一起儲存
const post = await prisma.post.create({
  data: {
    title: '我的文章',
    publishDate: new Date(),
    images: {
      create: uploadResult.data.images.map((img, index) => ({
        filename: img.filename,
        path: img.path,
        url: img.url,
        size: img.size,
        mimeType: img.mimeType,
        order: index,
      })),
    },
  },
  include: {
    images: {
      orderBy: { order: 'asc' },
    },
  },
});
```

### 查詢文章及圖片

```typescript
const posts = await prisma.post.findMany({
  include: {
    images: {
      orderBy: { order: 'asc' },
    },
  },
});

// 使用
posts.forEach(post => {
  console.log(post.title);
  post.images.forEach(image => {
    console.log(`圖片 URL: ${image.url}`);
  });
});
```

### 更新圖片排序

```typescript
// 批次更新圖片順序
const updatePromises = newOrder.map((imageId, index) => {
  return prisma.postImage.update({
    where: { id: imageId },
    data: { order: index },
  });
});

await Promise.all(updatePromises);
```

### 刪除文章（自動刪除關聯圖片）

```typescript
import { deleteImage } from '@/lib/file-upload.server';

// 1. 取得圖片路徑
const post = await prisma.post.findUnique({
  where: { id: postId },
  include: { images: true },
});

// 2. 刪除檔案
await Promise.all(
  post.images.map(image => deleteImage(image.path))
);

// 3. 刪除文章（Cascade 會自動刪除 PostImage 記錄）
await prisma.post.delete({
  where: { id: postId },
});
```

## 🎨 與 ImageUploadManager 整合

```typescript
import { ImageUploadManager } from '@/features/admin/post/components/imageUploadManager';
import { useUploadImages } from '@/server/upload/hooks';

function CreatePost() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const uploadImages = useUploadImages();

  const handleSubmit = async () => {
    // 1. 過濾出需要上傳的新圖片
    const newFiles = images
      .filter(img => img.file)
      .map(img => img.file!);

    // 2. 上傳到伺服器
    const uploadResult = await uploadImages.mutateAsync(newFiles);

    // 3. 建立文章
    await createPost({
      title: '...',
      images: uploadResult.data.images,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageUploadManager
        images={images}
        onImagesChange={setImages}
      />
      <button type="submit">發佈</button>
    </form>
  );
}
```

## 📁 檔案結構

```
public/
└── uploads/           # 圖片存儲目錄（不提交到 Git）
    └── 2024/
        └── 10/
            ├── uuid1.jpg
            ├── uuid2.png
            └── ...

app/
├── lib/
│   └── file-upload.server.ts  # 檔案上傳核心邏輯
├── routes/
│   └── api/
│       └── upload-images.tsx  # 上傳 API 路由
└── server/
    └── upload/
        ├── api.ts             # API client
        ├── hooks.ts           # React Query hooks
        └── README.md          # 本文件
```

## 🔧 配置

### 修改檔案大小限制

編輯 `app/lib/file-upload.server.ts`:

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 改為 10MB
```

### 修改允許的圖片類型

```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml', // 新增 SVG
];
```

### 生產環境建議

生產環境建議使用雲端儲存服務（如 AWS S3、Cloudinary）：

1. 安裝 SDK（例如 `@aws-sdk/client-s3`）
2. 修改 `file-upload.server.ts` 中的 `uploadImage` 函數
3. 上傳到雲端並返回公開 URL

## ⚠️ 注意事項

1. **不要提交上傳的圖片**：`public/uploads` 已加入 `.gitignore`
2. **定期清理**：考慮實作定期清理未使用的圖片
3. **備份**：記得備份上傳的圖片檔案
4. **CDN**：生產環境建議使用 CDN 加速圖片載入
5. **圖片優化**：考慮整合圖片壓縮服務（如 Sharp、ImageMagick）

