import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Formik, Form, Field, FieldProps } from 'formik';
import { useQuery } from 'react-query';

import ProjectService, { IProject } from '../services/Project';

import Task from './Task';

import TaskService, { ITask } from 'src/services/Task';

interface ProjectProps {
  project: IProject;
  refetchProjects: () => void;
}

const Project = ({ project, refetchProjects }: ProjectProps): JSX.Element => {
  const {
    data,
    isLoading,
    refetch: refetchTasks,
  } = useQuery('taskList' + project.id, () => TaskService.listTasks({ projectId: project.id }));

  const [todos, setTodos] = useState<ITask[]>([]);
  const [done, setDone] = useState<ITask[]>([]);

  useEffect(() => {
    const newTodos: ITask[] = [];
    const newDone: ITask[] = [];
    data?.forEach((task) => {
      if (task.done) {
        newDone.push(task);
      } else {
        newTodos.push(task);
      }
    });
    setTodos(newTodos);
    setDone(newDone);
  }, [data]);

  return (
    <Flex direction="column" shadow="md" pb={4}>
      <Flex bg="gray.200" justifyContent="space-between" alignItems="center" px={8} py={4} mb={2}>
        <Heading>{project.name}</Heading>
        <IconButton
          aria-label="Delete project"
          variant="ghost"
          colorScheme="red"
          onClick={async () => {
            await ProjectService.deleteProject({ id: project.id });
            refetchProjects();
          }}
          icon={<DeleteIcon />}
        />
      </Flex>

      {isLoading ? (
        <Spinner mx="auto" />
      ) : (
        <>
          {todos.length > 0 && <Heading fontSize="sm">To Do</Heading>}
          {todos.map((task) => (
            <Task key={task.id} refetch={refetchTasks} task={task} />
          ))}

          {done.length > 0 && <Heading fontSize="sm">Done</Heading>}
          {done.map((task) => (
            <Task key={task.id} refetch={refetchTasks} task={task} />
          ))}
        </>
      )}

      <Flex px={4} mt="auto">
        <Formik
          initialValues={{
            description: '',
          }}
          onSubmit={async (values, formik) => {
            await TaskService.createTask({ ...values, projectId: project.id });
            refetchTasks();
            formik.resetForm();
          }}
        >
          {(props) => (
            <Form>
              <Flex justifyContent="space-between">
                <Field name="description">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={!!(form.errors.description && form.touched.description)}
                    >
                      <Input {...field} id="description" placeholder="Task" />
                      <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button ml={4} colorScheme="green" isLoading={props.isSubmitting} type="submit">
                  Add todo
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default Project;
