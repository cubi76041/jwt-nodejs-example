export class ApiError {
  message: string;
  code: number;
  errors: any;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}

export default {
  // HTTP errors
  UNKNOWN: new ApiError(-1000, 'Unknown error occurred'),
  NOT_FOUND: new ApiError(-1001, 'Not found'),
  INVALID_ARGUMENTS: new ApiError(-1002, 'Invalid arguments'),

  // AUTH errors
  UNAUTHORIZED: new ApiError(-1010, 'Unauthorized'),
  PERMISSION_DENIED: new ApiError(-1011, 'Permission denied'),

  // api errors
  EMAIL_EXISTS: new ApiError(-1101, 'Email already exists'),
  INVALID_CREDENTIALS: new ApiError(-1102, 'Invalid email or password')
};
