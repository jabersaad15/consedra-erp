export interface PaginationParams {
  page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc';
}
export function buildPagination(p: PaginationParams) {
  const page = Math.max(1, p.page || 1);
  const limit = Math.min(100, Math.max(1, p.limit || 20));
  const skip = (page - 1) * limit;
  const orderBy: Record<string, string> = {};
  if (p.sortBy) orderBy[p.sortBy] = p.sortOrder || 'asc';
  else orderBy['createdAt'] = 'desc';
  return { page, limit, skip, orderBy };
}
export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}