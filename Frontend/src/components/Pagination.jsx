export const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="manager-pagination">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        ← Prev
      </button>
      <span>Page {page} of {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next →
      </button>
    </div>
  );
};