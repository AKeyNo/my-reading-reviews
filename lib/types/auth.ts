export interface AuthFields {
  username: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
}

export interface AuthErrors {
  usernameError: string | null;
  emailError: string | null;
  passwordError: string | null;
  confirmPasswordError: string | null;
}
