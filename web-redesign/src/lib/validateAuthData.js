export function validateUserCredentials({ email, username, password, type }) {
  // Regular expressions to check email, username, and password
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z]{5,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Check if either email or password is missing
  if (!email || !password) {
    return "Email and password are required";
  }

  // Check username
  if (
    (username && !usernameRegex.test(username)) ||
    (!username && type === "signup")
  ) {
    return "Name must be at least 5 characters long and contain only letters.";
  }

  // Check email
  if (!emailRegex.test(email.trim()) || !email) {
    return "Please enter a valid email address";
  }

  // Check password
  if (!passwordRegex.test(password) || !password) {
    return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)";
  }

  return null;
}
