import ClienError from './client-error.js';

class NotFoundError extends ClienError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
