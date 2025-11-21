export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const API_BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fetch a single page of posts with optional search query
export const fetchPosts = async (
  page: number, 
  limit: number, 
  searchQuery: string
): Promise<{ posts: Post[]; totalCount: number }> => {
  let url = `${API_BASE_URL}?_page=${page}&_limit=${limit}`;
  
  // JSONPlaceholder filtering is simple: search against a resource property
  if (searchQuery) {
    url += `&q=${encodeURIComponent(searchQuery)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  // JSONPlaceholder returns the total count in the 'X-Total-Count' header
  const totalCount = response.headers.get('X-Total-Count');
  const posts: Post[] = await response.json();

  return { 
    posts, 
    totalCount: totalCount ? parseInt(totalCount, 10) : posts.length * 2 // Estimate total if header is missing
  };
};