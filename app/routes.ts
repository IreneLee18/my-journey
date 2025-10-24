import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  layout('routes/layout.tsx', [
    route('about', 'routes/about.tsx'),
    route('posts', 'routes/posts.tsx'),
    route('posts/:id', 'routes/post.tsx'),
  ]),
  route('login', 'routes/login.tsx'),
  ...prefix('api', [
    route('login', 'routes/api/login.tsx'),
    route('logout', 'routes/api/logout.tsx'),
  ]),
  ...prefix('admin', [
    layout('routes/admin/layout.tsx', [
      route('posts', 'routes/admin/posts.tsx'),
      route('post/create', 'routes/admin/post/create.tsx'),
      route('post/edit/:id', 'routes/admin/post/edit.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
