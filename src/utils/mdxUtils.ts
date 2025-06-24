import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  id: number;
  title: string;
  date: string;
  description: string;
  type: string;
  content: string;
}

export function getPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), 'src/updates');
  
  if (!fs.existsSync(postsDirectory)) {
    console.error('Posts directory not found:', postsDirectory);
    return [];
  }
  
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        id: data.id,
        title: data.title,
        date: data.date,
        description: data.description,
        type: data.type,
        content
      };
    })
    .sort((a, b) => b.id - a.id); // Sort by ID from largest to smallest

  return posts;
} 