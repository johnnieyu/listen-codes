import { getPosts } from '../utils/mdxUtils';
import HomeClient from './HomeClient';

export default async function Home() {
  const posts = getPosts();
  
  return <HomeClient posts={posts} />;
}
