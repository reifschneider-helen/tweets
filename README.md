# Tweets App 🐦

A modern, responsive tweet application built with Next.js 15 and Sanity CMS.

## 🚀 Features

- **Sanity CMS Integration**: Complete content management solution
- **Pagination**: "Load more" functionality for better performance
- **TypeScript**: Fully typed for better developer experience
- **Next.js 15**: Latest features with Turbopack for fast development

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4.6 with React 19
- **CMS**: Sanity.io
- **Styling**: SCSS Modules
- **TypeScript**: Full type safety
- **Build Tool**: Turbopack (Next.js)
- **Image Optimization**: Next.js Image + Sanity Image URLs

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Sanity Account

## 🔧 Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/reifschneider-helen/tweets
   cd tweets
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Sanity configuration**

   - Create a Sanity project on [sanity.io](https://sanity.io)
   - Copy your Project ID
   - Configure `src/sanity/client.ts` with your credentials

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── tweets/          # API Route for tweets with pagination
│   │   └── users/[nickname] # API Route for user profiles
│   ├── components/
│   │   └── TweetCard.tsx    # Tweet component
│   ├── user/[nickname]/     # User Profile Pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # App layout
│   └── page.tsx             # Main page with tweet list
├── sanity/
│   └── client.ts            # Sanity client configuration
└── types/
    └── index.ts             # TypeScript definitions
```

## 🎨 Styling

The project has:

- **SCSS Modules**: For user profiles and complex components
- **Responsive Design**: Automatic adaptation to different screen sizes

### User Profile Grid Layout

- **Mobile**: 1 tweet per row
- **Desktop**: 2 tweets side by side
- **Automatic adaptation** with CSS Grid

## 📊 Sanity Schema

### User Schema

```typescript
{
  _id: string;
  name: string;
  nickname: string;
  bio?: string;
  photo?: SanityImageAsset;
  joinedDate: string;
  totalTweets: number;
}
```

### Tweet Schema

```typescript
{
  _id: string;
  text: string;
  createdAt: string;
  user: UserReference;
}
```

## 🔄 API Endpoints

### GET `/api/tweets`

- **Parameters**: `page`, `perPage`
- **Response**: `{ tweets: Tweet[], hasMore: boolean }`
- **Description**: Load tweets with pagination

### GET `/api/users/[nickname]`

- **Parameters**: `tweetsPage`
- **Response**: `{ user: UserWithStats, tweets: Tweet[], hasMore: boolean }`
- **Description**: Load user profile with tweets

## ⚡ Performance Features

- **Server-Side Rendering**: Optimal SEO and loading times
- **Image Optimization**: Automatic image optimization with Next.js
- **Pagination**: Lazy loading for better performance
- **Caching**: Sanity CDN integration with configurable cache
- **Turbopack**: Fast development environment

## 🎯 Main Features

### Main Page

- List of latest 6 tweets
- "Load more" button for pagination
- Responsive grid layout
- User links to profiles

### User Profile

- Detailed user information
- Bio and join date
- Tweet statistics
- Responsive 2-column layout for tweets
- Pagination for user tweets

### Tweet Cards

- User avatar and name
- Tweet text with formatting
- Timestamp
- Hover effects
- Responsive design

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
```

### Other Platforms

```bash
npm run build
npm start
```

## 🔧 Configuration

### Sanity Client (`src/sanity/client.ts`)

```typescript
export const client = createClient({
  projectId: "your-project-id",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
});
```

### Environment Variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Development server with Turbopack
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint checking
