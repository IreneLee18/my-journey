export const paths = {
  home: { url: '/', name: 'Home', zhName: '首頁' },
  login: { url: '/login', name: 'Login', zhName: '登入' },
  about: { url: '/about', name: 'About', zhName: '關於' },
  posts: { url: '/posts', name: 'Posts', zhName: '文章' },
  post: { url: '/posts', name: 'Post', zhName: '文章' },
};

export const adminPaths = {
  posts: { url: '/admin/posts', name: 'Posts', zhName: '文章管理' },
  postCreate: {
    url: '/admin/post/create',
    name: 'New Post',
    zhName: '建立文章',
  },
  postEdit: { url: '/admin/post/edit', name: 'Edit Post', zhName: '編輯文章' },
};
