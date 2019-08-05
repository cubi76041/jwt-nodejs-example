// API Response Wrapper

import { Request as ERequest, Response as EResponse } from 'express';
import errors, { ApiError } from '../config/error';

export interface Request extends ERequest {}

export interface Response extends EResponse {
  apiError: ApiError;
  apiSuccessStatus: number;
  apiFailureStatus: number;
  apiData: any;
}

const isEmpty = obj => {
  if (obj === null || typeof obj !== 'object') {
    return true;
  }

  if (obj instanceof Array) {
    return obj.length === 0;
  }

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
};

export const doApiResponse = (req: Request, res: Response) => {
  const { apiError, apiSuccessStatus, apiFailureStatus, apiData } = res;
  let successStatus: number,
    failureStatus: number,
    defaultFailureStatus: number = 400;

  if (apiError) {
    switch (apiError) {
      case errors.NOT_FOUND:
        defaultFailureStatus = 404;
        break;
      case errors.UNAUTHORIZED:
      case errors.PERMISSION_DENIED:
        defaultFailureStatus = 401;
        break;
      default:
        defaultFailureStatus = 400;
    }
  }

  switch (req.method.toLowerCase()) {
    case 'get':
      successStatus = 200;
      failureStatus = defaultFailureStatus;
      break;
    case 'post':
      successStatus = 201;
      failureStatus = defaultFailureStatus;
      break;
    case 'put':
    case 'patch':
    case 'delete':
      successStatus = isEmpty(apiData) ? 204 : 200;
      failureStatus = defaultFailureStatus;
      break;
    default:
      successStatus = 200;
      failureStatus = defaultFailureStatus;
  }

  successStatus = apiSuccessStatus || successStatus;
  failureStatus = apiFailureStatus || failureStatus;

  if (apiError) {
    let responseBody = {
      success: false,
      code: apiError.code,
      message: apiError.message,
      errors: []
    };

    if (apiError.errors) {
      responseBody.errors = apiError.errors;
    }

    return res.status(failureStatus).json(responseBody);
  } else if (isEmpty(apiData)) {
    res.status(successStatus).end();
  } else {
    return res.status(successStatus).json({
      success: true,
      data: apiData
    });
  }
};
