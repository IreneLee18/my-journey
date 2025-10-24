type ArticleProps = {
  publishDate: string;
  content: string;
}

export function Article({ publishDate, content }: ArticleProps) {
  return (
    <div className="w-full">
      <div className="w-full scrollbar-hide lg:overflow-y-auto lg:max-h-[calc(100vh-25rem)]">
        {/* Article Content - 使用 dangerouslySetInnerHTML 顯示 HTML */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 lg:text-right">
        發佈時間：{publishDate}
      </div>
    </div>
  );
}
