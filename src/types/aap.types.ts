export type PaginateResult<T> = {
  data: Array<T>;
  total: number;
  pages: number;
};