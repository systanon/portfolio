type ErrorOptions = {
  cause?: unknown;
};

export class AppError extends Error {
  public cause?: unknown; 
  constructor(message?: string, options?: ErrorOptions) {
    super(message);
    this.name = this.constructor.name;
    this.cause = options?.cause; 
  }
}
