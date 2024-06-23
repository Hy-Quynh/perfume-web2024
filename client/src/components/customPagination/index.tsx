import React, { useState } from 'react';

type CustomPaginationProps = {
  totalPage?: number;
  handlePageChange?: (page: number) => void;
};

export default function CustomPagination({
  totalPage,
  handlePageChange,
}: CustomPaginationProps) {
  const [currentPage, setCurentPage] = useState(1);

  return (
    <div className='col-12'>
      <nav>
        <ul className='pagination justify-content-center'>
          <li className='page-item'>
            <div
              className='page-link'
              onClick={() => {
                if (currentPage > 0) {
                  setCurentPage(currentPage - 1);
                  handlePageChange?.(currentPage - 1);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              Trang trước
            </div>
          </li>
          <li className='page-item active'>
            <div className='page-link'>
              {currentPage + ' / ' + totalPage}
            </div>
          </li>
          <li className='page-item'>
            <div
              className='page-link'
              onClick={() => {
                if (totalPage && currentPage < totalPage) {
                  setCurentPage(currentPage + 1);
                  handlePageChange?.(currentPage + 1);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              Trang sau
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
