import { CoreOutPut } from 'src/common/dtos/core.dto';

// Generic error response function
export function generateErrorResponse<T extends CoreOutPut>(
  message: string,
  statusCode: number,
): T {
  return {
    ok: false,
    message: [message],
    statusCode,
  } as T;
}

export function generateOkResponse<T extends CoreOutPut>(
  statusCode: number,
  data: Partial<T> = {}, // 추가 데이터를 위한 매개변수
): T {
  return {
    ok: true,
    ...data,
    statusCode,
  } as T;
}
