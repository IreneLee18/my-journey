import {
  type RouteConfig,
  index,
  layout,
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
] satisfies RouteConfig;
