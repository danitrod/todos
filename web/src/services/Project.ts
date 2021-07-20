import { API_URL } from '../config';

export interface IProject {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
}

export interface DeleteProjectPayload {
  id: number;
}

export default class ProjectService {
  static listProjects = async (): Promise<IProject[]> => {
    const response = await fetch(API_URL + '/projects', {
      method: 'GET',
    });

    if (response.status !== 200) {
      throw new Error();
    }

    const json = await response.json();

    return json;
  };

  static createProject = async (values: CreateProjectPayload): Promise<void> => {
    await fetch(API_URL + '/project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
  };

  static deleteProject = async ({ id }: DeleteProjectPayload): Promise<void> => {
    await fetch(API_URL + '/project/' + id, {
      method: 'DELETE',
    });
  };
}
