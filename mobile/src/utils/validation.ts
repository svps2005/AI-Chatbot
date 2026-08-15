/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validate name
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

/**
 * Validate message content
 */
export const isValidMessage = (message: string): boolean => {
  const trimmed = message.trim();
  return trimmed.length > 0 && trimmed.length <= 10000;
};

/**
 * Get password validation error message
 */
export const getPasswordErrorMessage = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

/**
 * Get email validation error message
 */
export const getEmailErrorMessage = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Get name validation error message
 */
export const getNameErrorMessage = (name: string): string | null => {
  if (!name) {
    return 'Name is required';
  }
  if (!isValidName(name)) {
    return 'Name must be at least 2 characters';
  }
  return null;
};

/**
 * Get message validation error message
 */
export const getMessageErrorMessage = (message: string): string | null => {
  if (!message) {
    return 'Message cannot be empty';
  }
  if (message.trim().length === 0) {
    return 'Message cannot be empty';
  }
  if (message.length > 10000) {
    return 'Message is too long';
  }
  return null;
};
