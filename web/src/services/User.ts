import { API_URL } from '../config';

type AuthenticateResponse =
  | {
      success: false;
    }
  | {
      success: true;
      name: string;
    };

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IRegisterPayload {
  username: string;
  name: string;
  password: string;
}

export default class UserService {
  static authenticate = async (): Promise<AuthenticateResponse> => {
    try {
      const response = await fetch(API_URL + '/user', {
        method: 'GET',
      });

      if (response.status !== 200) {
        return { success: false };
      }

      const json = await response.json();

      return { success: true, name: json.name };
    } catch {
      return { success: false };
    }
  };

  static login = async (values: ILoginPayload): Promise<boolean> => {
    try {
      const response = await fetch(API_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.status !== 200) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  static register = async (values: IRegisterPayload): Promise<boolean> => {
    try {
      const response = await fetch(API_URL + '/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.status !== 201) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  static logout = async (): Promise<void> => {
    await fetch(API_URL + '/logout', {
      method: 'POST',
    });
  };
}
