declare module 'passport-google-oauth20' {
  import { Strategy as PassportStrategy } from 'passport';

  export class Strategy extends PassportStrategy {
    constructor(
      options: any,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: Function
      ) => void
    );
  }
}
