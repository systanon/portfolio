export type SignUpDto = {
  email: string;
  password: string;
};

export type SignInDto = SignUpDto;

export type AuthResponse = {
  access_token: string;
};

export type AuthRequest = AuthResponse;

export type UserProfile = {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
};
