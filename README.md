# Welcome to my journey
Hi, this is Irene. I created this project to record my daily life.
Why did I come up with this idea❓❗️ Because I don't want to post on instagram or thread every day.
Thought this project you'll get to enjoy a glimpse of my life ❤️

## Tech Stack
- Built with React Router v7, React 19, Node.js and TypeScript
- Styled with Tailwind CSS v4 and Shadcn (Radix UI)
- Integrated Framer Motion to create smooth animations
- Equipped with TipTap as rich text editor for article content
- Implemented DnD Kit for drag and drop functionality (image sorting)
- Leveraged Zustand for global state management
- Powered by TanStack Query for data fetching and caching
- Utilized React Hook Form with Zod validation for form management
- Managed with Prisma as ORM for database management
- Connected to Supabase as cloud database service (authentication & storage)
- Enhanced with Husky and Commitizen as specification to standardize commit messages
- Deployed on Vercel

## Performance Optimization

### Image Compression
To optimize user experience, an intelligent image compression system has been implemented specifically for large-sized photos (commonly from iPhone high-resolution cameras):

##### Optimization Strategy:
- Automatically compress images to under 500KB
- Maximum size limit of 1200x1200px
- Dynamic quality adjustment (0.4-0.65)
- Multi-stage compression attempts to ensure the best balance between quality and file size

##### Performance Improvements:
- **File Size Reduction:** Average reduction of **75-80%** (2MB+ photos → under 500KB)
- **Upload Time Reduction:** Average savings of **75-80%** upload time
- **User Experience:** Fast photo uploads even in slower network environments