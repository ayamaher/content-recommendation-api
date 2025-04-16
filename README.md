# Content Recommendation API

## Setup
```bash
npm install
npm run dev
```
- or 
```bash
npm install
npm run build
npm run start
```
- you can use `content_recommendation.db` already seeded database or delete this file and run the following command 
## Seeding Data
```bash
npm run seed
```
## Testing
- for all tests
```bash
npm run test
```
- for cetatin test
```bash
npm run test src/tests/ContentFilterService.test.ts
```

## API Endpoints
- install `REST Client` Vscode extension to test API endpoints under `api-collections` folder
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recommendations` | Get personalized recommendations |
| GET | `/content/filter` | Filter content by type/category |
| POST | `/interactions` | Record user interaction |

## Business Description
The Recommendation API prioritizes content that matches users' preferences with dynamic pagination, ordered by:
1. **Relevance**: Content with tags matching the user's preferences gets highest priority
2. **Popularity**: More popular content (higher popularity score) ranks higher
3. **Recency**: Newer content (recently created) appears first when popularity is equal

This ensures users see the most relevant, trending, and fresh content first.

## Features
- Personalized recommendations based on user preferences
- Content filtering by type/category
- Interaction tracking (views, likes, bookmarks)
- RESTful endpoints with pagination
- Type-safe TypeScript implementation


## Suggested Enhancements
- secure API endpoints with authentication 
- cronJob to frequently update users prefrences based on recent content interactions tags
- composite key for interaction user and content per ineraction type to avoid duplicate entries





