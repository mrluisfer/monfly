export interface ApiResponse<T> {
  data: T;
  error?: boolean;
  message: string;
  statusCode?: number;
  success: boolean;
}
