import React, { memo } from 'react';

const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="w-1/3 flex justify-center">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-2 text-white bg-[#482070] rounded disabled:bg-gray-400"
            >
                이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => onPageChange(index + 1)}
                    className={`px-4 py-2 mx-2 ${currentPage === index + 1 ? "bg-[#482070] text-white" : "bg-gray-200 text-[#482070]"
                        }`}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-2 text-white bg-[#482070] rounded disabled:bg-gray-400"
            >
                다음
            </button>
        </div>
    );
});

export default Pagination; 