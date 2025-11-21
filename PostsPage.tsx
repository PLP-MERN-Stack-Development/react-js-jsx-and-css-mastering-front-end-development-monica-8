import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchPosts, type Post } from '../api/postsApi';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const POSTS_PER_PAGE = 10;

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for API call

  // Calculate total pages for pagination UI
  const totalPages = useMemo(() => Math.ceil(totalPosts / POSTS_PER_PAGE), [totalPosts]);

  // Function to fetch data from the API
  const loadPosts = useCallback(async (page: number, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const { posts: newPosts, totalCount } = await fetchPosts(page, POSTS_PER_PAGE, query);
      setPosts(newPosts);
      setTotalPosts(totalCount);
    } catch (err) {
      console.error(err);
      setError('Could not fetch data from the API. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect for initial load and pagination/search changes
  useEffect(() => {
    loadPosts(currentPage, searchQuery);
  }, [currentPage, searchQuery, loadPosts]);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    setSearchQuery(searchTerm);
  };

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-8">
        <h2 className="text-3xl font-bold mb-4">API Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-600 dark:text-blue-400">
        Fetched Posts (JSONPlaceholder)
      </h1>

      {/* Search Feature */}
      <Card className="mb-8 max-w-lg mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="Search posts by title or body..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          />
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>
      </Card>

      {/* Loading State */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Post Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Card key={post.id} className="flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400 capitalize">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 flex-grow">{post.body}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">User ID: {post.userId}</p>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1 || loading}
              variant="secondary"
              className="disabled:opacity-50"
            >
              Previous
            </Button>
            <span className="self-center text-lg font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= totalPages || loading}
              variant="secondary"
              className="disabled:opacity-50"
            >
              Next
            </Button>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Showing {posts.length} results. Total posts: {totalPosts}
          </p>
        </>
      )}
    </div>
  );
};

export default PostsPage;