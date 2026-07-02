export interface JwtPayload {
  sub: string;
  username: string;
  jti?: string; // unique ID — chỉ inject vào refresh token để hỗ trợ blacklist
}

export interface JwtDecoded extends JwtPayload {
  iat: number;
  exp: number;
}
