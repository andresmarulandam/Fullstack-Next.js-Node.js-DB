import axios from 'axios';

const REQRES_API = process.env.REQRES_API_URL;

// Mock data de ReqRes para desarrollo
const MOCK_USERS = {
  1: {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
  },
  2: {
    id: 2,
    email: 'janet.weaver@reqres.in',
    first_name: 'Janet',
    last_name: 'Weaver',
    avatar: 'https://reqres.in/img/faces/2-image.jpg',
  },
  3: {
    id: 3,
    email: 'emma.wong@reqres.in',
    first_name: 'Emma',
    last_name: 'Wong',
    avatar: 'https://reqres.in/img/faces/3-image.jpg',
  },
};

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
  async getUserById(id: number) {
    try {
      const response = await axios.get(`${REQRES_API}/users/${id}`);
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        console.log('⚠️ ReqRes blocked by Cloudflare, using mock...');

        const mockUser = MOCK_USERS[id as keyof typeof MOCK_USERS];

        if (mockUser) {
          return {
            status: 200,
            data: { data: mockUser },
          };
        } else {
          return {
            status: 404,
            data: { error: 'User not found' },
          };
        }
      }

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
