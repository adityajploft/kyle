import React, { useState } from "react";

const Pagination = ({ totalPage, currentPage, onPageChange }) => {
  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
  };

  return (
    <div>
      <nav>
        <ul className="pagination justify-content-end pagination-md">
          {currentPage > 1 ? (
            <li className="page-item ">
              <a
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </a>
            </li>
          ) : (
            ""
          )}

          {Array.from({ length: totalPage }).map((_, index) => (
            <li
              key={index}
              className={
                currentPage === index + 1 ? "page-item active" : "page-item"
              }
            >
              <a
                className="page-link"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </a>
            </li>
          ))}

          {totalPage != currentPage ? (
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </a>
            </li>
          ) : (
            ""
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
