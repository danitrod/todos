import { API_URL } from '../config';

export interface ITask {
  id: number;
  description: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
}

export interface ListTasksPayload {
  projectId: number;
}

export interface CreateTaskPayload {
  description: string;
  projectId: number;
}

export interface ToggleTaskPayload {
  id: number;
  done: boolean;
}

export interface DeleteTaskPayload {
  id: number;
}

export default class TaskService {
  static listTasks = async ({ projectId }: ListTasksPayload): Promise<ITask[]> => {
    const response = await fetch(API_URL + '/tasks?projectId=' + projectId, {
      method: 'GET',
    });

    if (response.status !== 200) {
      throw new Error();
    }

    const json = await response.json();

    return json;
  };

  static createTask = async (values: CreateTaskPayload): Promise<void> => {
    await fetch(API_URL + '/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
  };

  static toggle = async (values: ToggleTaskPayload): Promise<void> => {
    await fetch(API_URL + '/task/toggle', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
  };

  static deleteTask = async (values: DeleteTaskPayload): Promise<void> => {
    await fetch(API_URL + '/task/' + values.id, {
      method: 'DELETE',
    });
  };
}
