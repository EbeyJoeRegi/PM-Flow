export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export const formatStatus = (status) => {
    switch (status) {
      case 'NOT_STARTED': return 'Not Started';
      case 'IN_PROGRESS': return 'In Progress';
      case 'ON_HOLD': return 'On Hold';
      case 'COMPLETED': return 'Completed';
      default: return status;
    }
  };

export const getBootstrapBgClass = (status) => {
    switch (status) {
      case 'Not Started': return 'bg-secondary';
      case 'In Progress': return 'bg-primary';
      case 'Completed': return 'bg-success';
      case 'On Hold': return 'bg-warning';
      default: return 'bg-light text-dark';
    }
  };