class ClienError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ClienError';
    this.statusCode = statusCode;
  }
}

export default ClienError;
