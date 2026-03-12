import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { blogs } from './blog';

export const BlogPage = () => {
  // 1. Reference to the top of the page for smooth scrolling
  const topRef = useRef<HTMLDivElement>(null);

  // 2. Use data from blog.ts
  const allStudyMaterials = blogs;

  // 3. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Set to 6 so there are exactly 2 pages for 12 classes

  // 4. Scroll to top whenever the page changes
  useEffect(() => {
    if (topRef.current) {
      // scrollIntoView works perfectly even inside scrollable divs (like your AppLayout)
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]); // This effect runs every time currentPage updates

  // 5. Pagination Logic
  const totalPosts = allStudyMaterials.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = Math.min(startIndex + postsPerPage, totalPosts);
  const currentPosts = allStudyMaterials.slice(startIndex, endIndex);

  // 6. Handlers for buttons
  const goToPage = (page: React.SetStateAction<number>) => setCurrentPage(page);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="bg-gray-50 font-sans min-h-screen w-full">
      {/* Invisible div acting as our scroll anchor */}
      <div ref={topRef} className="h-0 w-0" />

      {/* INCREASED WIDTH HERE: Changed from max-w-7xl to max-w-[1400px] */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 md:px-8">

        {/* Blog Grid */}
        <div className="flex justify-center">
          <div className="inline-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Card Image */}
              <div className="h-52 bg-gray-200 overflow-hidden p-3 rounded-t-xl">
                 <div className="w-full h-full rounded-lg overflow-hidden relative">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                 </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">
                  {post.category}
                </p>
                <h2 className="text-lg font-semibold text-gray-800 leading-snug mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-xs text-gray-500 italic mb-4">
                  {post.meta}
                </p>
                <p className="text-sm text-gray-600 mb-6 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Button pinned to bottom */}
                {/* Link pinned to bottom */}
                <Link 
                 to={`/blogs/${post.slug}`}
                  className="w-full py-2.5 bg-[#ffed00] hover:bg-yellow-400 text-black font-medium text-sm rounded transition-colors mt-auto text-center block shadow-sm"
                >
                  Read More
                </Link>
              </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Pagination */}
        <div className="mt-12 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-600">
          <div className="flex space-x-1">
            
            <button 
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="px-3 md:px-4 py-2 border border-gray-200 bg-white text-gray-600 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              First
            </button>
            
            <button 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 md:px-4 py-2 border border-gray-200 bg-white text-gray-600 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {pageNumbers.map(number => (
              <button 
                key={number}
                onClick={() => goToPage(number)}
                className={`px-3 md:px-4 py-2 font-medium rounded shadow-sm transition-all duration-200 ${
                  currentPage === number 
                    ? "bg-[#ffed00] text-black" 
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-[#fef08a]" 
                }`}
              >
                {number}
              </button>
            ))}
            
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 md:px-4 py-2 bg-[#ffed00] text-black font-medium rounded shadow-sm hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
            
            <button 
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="px-3 md:px-4 py-2 bg-[#ffed00] text-black font-medium rounded shadow-sm hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Last
            </button>

          </div>
          
          <div className="font-medium text-gray-500">
            Showing {startIndex + 1}-{endIndex} of {totalPosts} classes
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BlogPage;