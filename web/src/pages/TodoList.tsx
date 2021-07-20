import { Flex, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import Navbar from '../components/Navbar';
import ProjectsService from '../services/Project';

import CreateProjectForm from 'src/components/CreateProjectForm';
import Project from 'src/components/Project';

const TodoList = (): JSX.Element => {
  const { data, refetch } = useQuery('listProjects', ProjectsService.listProjects);

  const [todoList, setTodoList] = useState([<CreateProjectForm key="create" refetch={refetch} />]);

  useEffect(() => {
    if (data) {
      setTodoList([
        ...data.map((project) => (
          <Project key={project.id} project={project} refetchProjects={refetch} />
        )),
        <CreateProjectForm key="create" refetch={refetch} />,
      ]);
    }
  }, [data]);

  return (
    <>
      <Navbar />
      <main>
        <Flex px={8}>
          <SimpleGrid columns={[2, 4]} spacing={16}>
            {todoList}
          </SimpleGrid>
        </Flex>
      </main>
    </>
  );
};

export default TodoList;
