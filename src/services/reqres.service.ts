import axios from 'axios';

const REQRES_API = process.env.REQRES_API_URL;

export const reqresService = {
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${REQRES_API}/login`, {
        email,
        password,
      });

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      if (error.response) {
        return {
          status: error.response.status,
          data: error.response.data,
        };
      }

      console.error('Error calling Reqres:', error.message);
      throw error;
    }
  },
};
