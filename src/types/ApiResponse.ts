export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  error?: boolean;
  statusCode?: number;
};
