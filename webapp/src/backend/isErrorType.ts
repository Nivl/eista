const isErrorType = (error: unknown): error is Error => error instanceof Error;

export default isErrorType;
