import { useEffect } from 'react';

export const BlogDetail = () => {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. Data for LATEST ARTICLES (e.g., Classes 1 to 6)
  const latestArticles = [
    {
      id: 1,
      title: "Foundational Math: Playing with Numbers",
      date: "March 10, 2026",
      category: "Class 1 • Math",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      title: "Exploring Our World: Plants and Animals",
      date: "March 08, 2026",
      category: "Class 2 • Science",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      title: "Building Vocabulary and Reading Comprehension",
      date: "March 05, 2026",
      category: "Class 3 • English",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 4,
      title: "Understanding Maps and Earth's Landforms",
      date: "March 02, 2026",
      category: "Class 4 • Geography",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 6,
      title: "Middle School Physics: Force and Motion",
      date: "February 25, 2026",
      category: "Class 6 • Physics",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=200&q=80"
    }
  ];

  // 2. Data for RELATED ARTICLES (e.g., Classes 7 to 12)
  const relatedArticles = [
    {
      id: 7,
      title: "Ancient Civilizations and Global Cultures",
      date: "March 09, 2026",
      category: "Class 7 • History",
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 8,
      title: "Introduction to Elements and the Periodic Table",
      date: "March 07, 2026",
      category: "Class 8 • Chemistry",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 9,
      title: "Algebraic Expressions and Geometry Basics",
      date: "March 04, 2026",
      category: "Class 9 • Math",
      image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 11,
      title: "Advanced Mechanics and Thermodynamics",
      date: "March 01, 2026",
      category: "Class 11 • Physics",
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 12,
      title: "Calculus, Integration, and Data Analysis",
      date: "February 27, 2026",
      category: "Class 12 • Math",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 13,
      title: "How to Create an Effective Study Schedule for Boards",
      date: "February 20, 2026",
      category: "Study Tips",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className="bg-white font-sans min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        
        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Main Article Content */}
          <div className="w-full lg:w-[65%] xl:w-[70%] border border-gray-100 shadow-sm rounded-lg overflow-hidden bg-white">
            
            {/* Hero Image */}
            <div className="w-full h-[300px] md:h-[450px] bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80" 
                alt="Biology Study" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content Padding Container */}
            <div className="p-6 md:p-10">
              
              {/* Category & Title */}
              <p className="text-[12px] font-bold text-blue-700 uppercase tracking-widest mb-3">
                CLASS 10 • BIOLOGY
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight mb-4">
                Life Processes: A Deep Dive into Human Anatomy and Genetics
              </h1>
              
              {/* Meta Data */}
              <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">
                Chapter 8 / Life Sciences / Diagram Notes
              </p>

              {/* Social Share Buttons */}
              <div className="flex items-center space-x-2 mb-10">
                <span className="text-gray-500 text-sm font-medium mr-2">Share</span>
                {/* Facebook */}
                <button className="w-8 h-8 bg-[#1877f2] flex items-center justify-center text-white rounded-sm hover:opacity-90">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                {/* X (Twitter) */}
                <button className="w-8 h-8 bg-black flex items-center justify-center text-white rounded-sm hover:opacity-90">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                {/* LinkedIn */}
                <button className="w-8 h-8 bg-[#0a66c2] flex items-center justify-center text-white rounded-sm hover:opacity-90">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </button>
                {/* WhatsApp */}
                <button className="w-8 h-8 bg-[#25d366] flex items-center justify-center text-white rounded-sm hover:opacity-90">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.393.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.418-.099.824z"/></svg>
                </button>
                {/* Share Icon */}
                <button className="w-8 h-8 bg-gray-500 flex items-center justify-center text-white rounded-sm hover:opacity-90">
                   <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
                </button>
              </div>

              {/* Blog Text Content */}
              <div className="prose max-w-none text-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
                <p className="mb-6 leading-relaxed">
                  Biology is the study of living organisms, their structure, function, growth, origin, evolution, and distribution. In Class 10, we take a deep dive into biological systems, which is crucial not just for your board exams, but for understanding how your own body works.
                </p>
                <p className="mb-8 leading-relaxed">
                  This study guide will help you navigate the complexities of human anatomy, reproduction, and genetics, turning difficult concepts into easy-to-remember points.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Life Processes</h2>
                <p className="mb-4 leading-relaxed">
                  To maintain life, organisms must perform certain basic functions. Here are the core processes you need to master:
                </p>
                
                <ol className="list-decimal pl-6 mb-8 space-y-3">
                  <li><strong>Nutrition:</strong> The process of taking in food and utilizing it for energy.</li>
                  <li><strong>Respiration:</strong> Breaking down of food sources to release energy.</li>
                  <li><strong>Transportation:</strong> Moving essential substances (like oxygen and nutrients) throughout the body via the circulatory system.</li>
                  <li><strong>Excretion:</strong> The vital process of removing toxic waste byproducts from the body.</li>
                </ol>

                <p className="mb-6 leading-relaxed">
                  Make sure to practice drawing the diagrams for the human heart, respiratory system, and excretory system, as these are high-scoring questions in your final exams!
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Takes up less space) */}
          <div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col space-y-8">
            
            {/* LATEST ARTICLES WIDGET */}
            <div className="bg-gray-50 p-6 border border-gray-100 rounded-lg">
              <div className="inline-block bg-[#ffed00] text-black font-bold text-[13px] px-3 py-1.5 uppercase tracking-wide mb-6">
                LATEST ARTICLES
              </div>
              
              {/* Added max-height and custom scrollbar styles to match design */}
              <div className="flex flex-col space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {latestArticles.map((article) => (
                  <div key={article.id} className="flex gap-4 group cursor-pointer">
                    <img 
                      src={article.image} 
                      alt="Thumbnail" 
                      className="w-20 h-20 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex flex-col justify-center">
                      <h3 className="text-[14px] font-semibold text-gray-800 leading-snug group-hover:text-yellow-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-[12px] text-gray-500 mt-2">
                        {article.category} | {article.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RELATED ARTICLES WIDGET */}
            <div className="bg-gray-50 p-6 border border-gray-100 rounded-lg">
              <div className="inline-block bg-[#ffed00] text-black font-bold text-[13px] px-3 py-1.5 uppercase tracking-wide mb-6">
                RELATED ARTICLES
              </div>
              
              <div className="flex flex-col space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {relatedArticles.map((article) => (
                  <div key={`related-${article.id}`} className="flex gap-4 group cursor-pointer">
                    <img 
                      src={article.image} 
                      alt="Thumbnail" 
                      className="w-20 h-20 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex flex-col justify-center">
                      <h3 className="text-[14px] font-semibold text-gray-800 leading-snug group-hover:text-yellow-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-[12px] text-gray-500 mt-2">
                        {article.category} | {article.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;