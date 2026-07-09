export interface PaginatedResponse<T> {
  items:   T[]
  total:   number
  limit:   number
  offset:  number
}

export interface CursorResponse<T> {
  items:       T[]
  next_cursor: string | null
}
