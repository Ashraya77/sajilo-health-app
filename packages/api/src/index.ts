export interface ApiResponse<TData> {
  readonly data: TData;
  readonly message?: string;
}
