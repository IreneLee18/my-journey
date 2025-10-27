import type { Language } from '@/stores/languageStore';

export type TranslationKey = 
  // Common
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.confirm'
  | 'common.cancel'
  | 'common.save'
  | 'common.delete'
  | 'common.edit'
  | 'common.create'
  | 'common.back'
  | 'common.next'
  | 'common.previous'
  | 'common.search'
  | 'common.filter'
  | 'common.submit'
  | 'common.close'
  
  // Header
  | 'header.title'
  | 'header.toggleTheme'
  | 'header.toggleLanguage'
  | 'header.login'
  | 'header.logout'
  
  // Navigation
  | 'nav.home'
  | 'nav.about'
  | 'nav.posts'
  | 'nav.contact'
  
  // Admin Header
  | 'admin.header.title'
  | 'admin.header.backToFrontend'
  | 'admin.header.toggleMenu'
  
  // Admin Navigation
  | 'admin.nav.posts'
  | 'admin.nav.settings'
  
  // Posts
  | 'posts.title'
  | 'posts.readMore'
  | 'posts.noPostsFound'
  | 'posts.loadingPosts'
  
  // Post Detail
  | 'post.back'
  | 'post.publishedOn'
  | 'post.updatedOn'
  
  // Login
  | 'login.title'
  | 'login.username'
  | 'login.password'
  | 'login.submit'
  | 'login.error'
  
  // About
  | 'about.title'
  
  // Home Page
  | 'home.greeting.desktop'
  | 'home.greeting.mobile.line1'
  | 'home.greeting.mobile.line2'
  
  // About Page
  | 'about.page.title'
  | 'about.introduction.title'
  | 'about.introduction.p1'
  | 'about.introduction.p2'
  | 'about.project.title'
  | 'about.project.p1'
  | 'about.project.p2'
  | 'about.project.p3'
  | 'about.project.p4'
  | 'about.connect.title'
  | 'about.connect.p1'
  
  // Login Page
  | 'login.welcome'
  | 'login.subtitle'
  | 'login.email'
  | 'login.emailPlaceholder'
  | 'login.passwordPlaceholder'
  | 'login.rememberMe'
  | 'login.loggingIn'
  | 'login.backToHome'
  
  // Posts List
  | 'posts.loading'
  | 'posts.error'
  | 'posts.empty'
  
  // Post Detail
  | 'post.loading'
  | 'post.error'
  | 'post.notFound'
  | 'post.goBack';

export type Translations = {
  [key in TranslationKey]: string;
};

export const translations: Record<Language, Translations> = {
  zh: {
    // Common
    'common.loading': '載入中...',
    'common.error': '錯誤',
    'common.success': '成功',
    'common.confirm': '確認',
    'common.cancel': '取消',
    'common.save': '儲存',
    'common.delete': '刪除',
    'common.edit': '編輯',
    'common.create': '建立',
    'common.back': '返回',
    'common.next': '下一頁',
    'common.previous': '上一頁',
    'common.search': '搜尋',
    'common.filter': '篩選',
    'common.submit': '送出',
    'common.close': '關閉',
    
    // Header
    'header.title': "Irene Lee's Journey",
    'header.toggleTheme': '切換主題',
    'header.toggleLanguage': '切換語言',
    'header.login': '登入',
    'header.logout': '登出',
    
    // Navigation
    'nav.home': '首頁',
    'nav.about': '關於',
    'nav.posts': '文章',
    'nav.contact': '聯絡',
    
    // Admin Header
    'admin.header.title': "Irene's Lee Journey 後台",
    'admin.header.backToFrontend': '回到前台',
    'admin.header.toggleMenu': '切換選單',
    
    // Admin Navigation
    'admin.nav.posts': '文章管理',
    'admin.nav.settings': '設定',
    
    // Posts
    'posts.title': '所有文章',
    'posts.readMore': '閱讀更多',
    'posts.noPostsFound': '找不到文章',
    'posts.loadingPosts': '載入文章中...',
    
    // Post Detail
    'post.back': '返回文章列表',
    'post.publishedOn': '發佈於',
    'post.updatedOn': '更新於',
    
    // Login
    'login.title': '登入',
    'login.username': '使用者名稱',
    'login.password': '密碼',
    'login.submit': '登入',
    'login.error': '登入失敗',
    
    // About
    'about.title': '關於',
    
    // Home Page
    'home.greeting.desktop': '嗨，我是 Irene，歡迎來到我的旅程。',
    'home.greeting.mobile.line1': '嗨，我是 Irene',
    'home.greeting.mobile.line2': '歡迎來到我的旅程',
    
    // About Page
    'about.page.title': '關於',
    'about.introduction.title': '嗨，我是 Irene Lee',
    'about.introduction.p1': '我是一名擁有 3 年以上經驗的前端工程師，熱衷於打造可靠、優雅且有影響力的數位體驗。',
    'about.introduction.p2': '我喜歡將創意與技術結合，提供不僅運作良好，而且使用起來感覺很棒的可擴展解決方案。',
    'about.project.title': '關於這個專案',
    'about.project.p1': '這個專案對我來說很私人——一個小小的數位空間，我在這裡記錄我的日常生活，包括想法、照片和讓每一天獨特的小時刻。',
    'about.project.p2': '為什麼我會有這個想法❓❗️',
    'about.project.p3': '因為我不想每天都在 Instagram 或 Threads 上發文 😆',
    'about.project.p4': '透過這個專案，你可以一窺我的生活 ❤️',
    'about.connect.title': '讓我們聯繫',
    'about.connect.p1': '如果你對這個專案感到好奇，或想聊聊前端開發、創意或數位生活——隨時歡迎聯繫我 ✨',
    
    // Login Page
    'login.welcome': '歡迎回來',
    'login.subtitle': '請輸入您的帳號資訊以登入',
    'login.email': '帳號',
    'login.emailPlaceholder': '請輸入您的電子郵件',
    'login.passwordPlaceholder': '請輸入您的密碼',
    'login.rememberMe': '記住我',
    'login.loggingIn': '登入中...',
    'login.backToHome': '返回首頁',
    
    // Posts List
    'posts.loading': '載入中...',
    'posts.error': '錯誤',
    'posts.empty': '尚無文章',
    
    // Post Detail
    'post.loading': '載入中...',
    'post.error': '錯誤',
    'post.notFound': '找不到文章',
    'post.goBack': '返回文章列表',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.submit': 'Submit',
    'common.close': 'Close',
    
    // Header
    'header.title': "Irene Lee's Journey",
    'header.toggleTheme': 'Toggle Theme',
    'header.toggleLanguage': 'Toggle Language',
    'header.login': 'Login',
    'header.logout': 'Logout',
    
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.posts': 'Posts',
    'nav.contact': 'Contact',
    
    // Admin Header
    'admin.header.title': "Irene's Lee Journey Admin",
    'admin.header.backToFrontend': 'Back to Frontend',
    'admin.header.toggleMenu': 'Toggle Menu',
    
    // Admin Navigation
    'admin.nav.posts': 'Posts Management',
    'admin.nav.settings': 'Settings',
    
    // Posts
    'posts.title': 'All Posts',
    'posts.readMore': 'Read More',
    'posts.noPostsFound': 'No posts found',
    'posts.loadingPosts': 'Loading posts...',
    
    // Post Detail
    'post.back': 'Back to Posts',
    'post.publishedOn': 'Published on',
    'post.updatedOn': 'Updated on',
    
    // Login
    'login.title': 'Login',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.error': 'Login failed',
    
    // About
    'about.title': 'About',
    
    // Home Page
    'home.greeting.desktop': 'Hi this is Irene, Welcome to my journey.',
    'home.greeting.mobile.line1': 'Hi this is Irene,',
    'home.greeting.mobile.line2': 'Welcome to my journey.',
    
    // About Page
    'about.page.title': 'About',
    'about.introduction.title': "Hi, I'm Irene Lee",
    'about.introduction.p1': "I'm a front-end engineer with 3+ years of experience, passionate about crafting reliable, elegant, and impactful digital experiences.",
    'about.introduction.p2': 'I love bridging creativity and technology to deliver scalable solutions that not only work well but also feel great to use.',
    'about.project.title': 'About This Project',
    'about.project.p1': 'This project is something personal to me — a little digital space where I record my daily life, including thoughts, photos, and small moments that make each day unique.',
    'about.project.p2': 'Why did I come up with this idea❓❗️',
    'about.project.p3': "Because I don't want to post on Instagram or Threads every day 😆",
    'about.project.p4': "Through this project, you'll get to enjoy a glimpse of my life ❤️",
    'about.connect.title': "Let's Connect",
    'about.connect.p1': "If you're curious about this project or want to chat about front-end development, creativity, or digital life — feel free to reach out anytime ✨",
    
    // Login Page
    'login.welcome': 'Welcome Back',
    'login.subtitle': 'Please enter your credentials to login',
    'login.email': 'Email',
    'login.emailPlaceholder': 'Please enter your email',
    'login.passwordPlaceholder': 'Please enter your password',
    'login.rememberMe': 'Remember me',
    'login.loggingIn': 'Logging in...',
    'login.backToHome': 'Back to Home',
    
    // Posts List
    'posts.loading': 'Loading...',
    'posts.error': 'Error',
    'posts.empty': 'No posts yet',
    
    // Post Detail
    'post.loading': 'Loading...',
    'post.error': 'Error',
    'post.notFound': 'Post not found',
    'post.goBack': 'Go Back To Posts',
  },
};

