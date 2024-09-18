export interface ApiResponse<D> {
  ok: boolean;
  data?: D;
  status: number;
}
