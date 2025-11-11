import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

if (
  typeof rpcError === 'object' &&
  rpcError !== null &&
  'status' in rpcError &&
  'message' in rpcError
) {
  const errorObj = rpcError as { status: number | string; message: string };

  const status = isNaN(+errorObj.status) ? 400 : +errorObj.status;
  return response.status(status).json(errorObj);
}
    response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}