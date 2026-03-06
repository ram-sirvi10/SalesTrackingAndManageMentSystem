import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({
  currentPage = 0,
  totalPages = 0,
  totalElements = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  className = "",
}) => {

  if (totalElements === 0) return null;

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
    
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
    
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 2);

      const showLeftDots = leftSiblingIndex > 1;
      const showRightDots = rightSiblingIndex < totalPages - 2;
      pages.push(0);

      if (showLeftDots) {
        pages.push("...");
      }

     
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }

      if (showRightDots) {
        pages.push("...");
      }

 
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 ${className}`}>
    
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-800">{startItem}</span> to{" "}
          <span className="font-semibold text-gray-800">{endItem}</span> of{" "}
          <span className="font-semibold text-gray-800">{totalElements}</span> results
        </div>
        

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          <ChevronsLeft size={18} />
        </button>

  
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

    
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? "bg-primary-600 text-white shadow-md"
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {page + 1}
              </button>
            );
          })}
        </div>

   
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight size={18} />
        </button>

       
        <button
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Last page"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
