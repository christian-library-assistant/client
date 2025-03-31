# Smart Library Assistant

Smart Library Assistant provides conversational access to centuries of Christian theological works, making historical wisdom accessible through modern AI technology.

## Overview

This project aims to bridge the gap between historical Christian texts and contemporary readers by leveraging artificial intelligence to provide intuitive, conversational access to theological wisdom spanning centuries. By combining the comprehensive Christian Classics Ethereal Library with state-of-the-art natural language processing, we've created a tool that allows users to explore, understand, and apply theological insights through natural conversation.

## Key Features

- **Theological Expertise**: Access insights from centuries of Christian theological works with natural language queries
- **CCEL Dataset Integration**: Powered by the comprehensive Christian Classics Ethereal Library collection
- **AI-Powered Smart Search**: Semantic search capabilities that understand the context of your theological inquiries
- **Auto-Citation with Source**: Every insight comes with proper attribution to its original source text

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app`: Main application pages and layouts
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and shared code

## Key Principles

- **Faithful Representation**: We prioritize accurate representation of source texts, ensuring theological integrity in all interactions
- **Accessibility**: Making theological wisdom accessible to everyone, regardless of their background or expertise
- **Technological Innovation**: Leveraging cutting-edge AI to create intuitive, natural interactions with historical texts
- **Educational Focus**: Designed as a learning tool to deepen understanding of Christian theology and history

## Technologies Used

- **Next.js**: React framework for building the web application
- **Tailwind CSS**: For styling and responsive design
- **Shadcn UI**: Component library for consistent UI elements
- **Vector Search**: For semantic retrieval of relevant theological content

## API Integration

The application connects to a vector search API endpoint to retrieve relevant theological content based on user queries. This is configured in the Next.js configuration to proxy requests to the appropriate backend service.

## Team

- David Kim - Developer
- Jeton Cesaj - Developer
- Zhonglin (Loya) Niu - Developer

**Project Advisor**: Harry Plantinga - Director of the Christian Classics Ethereal Library (CCEL) and Professor of Computer Science at Calvin University

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Christian Classics Ethereal Library](https://www.ccel.org/)

## License

© 2025 Smart Library Assistant. All rights reserved.
