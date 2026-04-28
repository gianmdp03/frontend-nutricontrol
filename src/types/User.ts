export interface AuthenticationPasswordDTO {
  email: string;
  password: string;
  token: string;
}

export interface AuthenticationRequestDTO {
  loginInput: string;
  password: string;
}

export interface AuthenticationResponseDTO {
  token: string;
  dto: bigint;
}

export interface AdminDetailDTO {
  id: string;
  name: string;
  lastname: string;
  profilePicture: string;
  email: string;
}

export interface UserRequestDTO {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export interface UserUpdateDTO {
  name: string;
  lastname: string;
  username: string;
  email: string;
  role: Role;
}

export interface UserUpdatePassDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UserDetailDTO extends Omit<UserRequestDTO, "password"> {
  id: string;
  role: Role;
  banned: boolean;
  isEmailConfirmed: boolean;
  profilePicture: string;
}

export interface UserProfilePictureDTO {
  profilePicture: string;
}

enum Role {
  ROLE_PATIENT,
  ROLE_ADMIN,
}
