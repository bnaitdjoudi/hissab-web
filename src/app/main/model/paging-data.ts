export interface PagingData<T> {
  data: T[];
  totalPage: number;
  currentPage: number;
}
