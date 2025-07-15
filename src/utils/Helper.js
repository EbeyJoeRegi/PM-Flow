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
      case 'Not Started': return 'bg-primary text-light';
      case 'In Progress': return 'bg-warning text-light';
      case 'Completed': return 'bg-success text-light';
      case 'On Hold': return 'bg-secondary text-light';
      default: return 'bg-light text-dark';
    }
  };

export const getTaskPriorityClass = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'text-danger';
      case 'MEDIUM':
        return 'text-warning';
      case 'LOW':
        return 'text-success';
      default:
        return '';
    }
  };

export function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}