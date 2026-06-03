import ClienError from './client-error.js';

class InvariantError extends ClienError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

export default InvariantError;
