
// ===== INTERFACES =====
interface Cita {
  id: number;
  codigo: string;
  cliente: string;
  fecha: string;
  hora: string;
  servicio: string;
  empleado: string;
  estado: string;
}

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}