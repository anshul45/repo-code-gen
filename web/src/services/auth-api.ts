import axios from 'axios';

export class AuthService {
  static async signInWithGoogle(idToken: string) {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/signin`, { idToken });
      if (res.data) {
        return res.data;
      }
    } catch (error) {
      throw error;
    }
  }
}

export const { signInWithGoogle } = AuthService;
