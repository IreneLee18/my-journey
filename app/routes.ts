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
  ...prefix('admin', [
    layout('routes/admin/layout.tsx', []),
  ]),
] satisfies RouteConfig;
