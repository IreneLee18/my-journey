type ArticleProps = {
  publishDate: string;
  content: string;
}
export function Article({ publishDate, content }: ArticleProps) {
  return (
    <div className="w-full">
      <div className="w-full scrollbar-hide lg:overflow-y-auto lg:max-h-[calc(100vh-25rem)]">
        {/* Desktop: Publish date on top right
      <div className="hidden lg:block text-right text-sm text-gray-500 dark:text-gray-400 ">
        發佈時間：{publishDate}
      </div> */}

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
            {content}
          </div>
        </div>

        {/* Mobile/Tablet: Publish date on bottom */}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 lg:text-right">
        發佈時間：{publishDate}
      </div>
    </div>
  );
}
