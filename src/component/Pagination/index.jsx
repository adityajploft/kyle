import React, { useState } from 'react';
import { PaginationControl } from 'react-bootstrap-pagination-control';

const Pagination = ({page, setPage, total, limit}) => {
    return (
        <div className='pagination-section text-end'>
            <PaginationControl
                page={page}
                between={4}
                total={total}
                limit={limit}
                changePage={(page) => {
                    setPage(page)
                }}
                ellipsis={1}
            />
        </div>
    )
}
export default Pagination;