import React, { useState } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

import TodoList from './TodoList';

import useAuth from 'src/context/auth';
import LoginForm from 'src/components/LoginForm';
import RegisterForm from 'src/components/RegisterForm';

const Index = (): JSX.Element => {
  const { loading, authenticated } = useAuth();

  const [showRegisterForm, setShowRegisterForm] = useState(false);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />;
      </Flex>
    );
  }

  if (authenticated) {
    return <TodoList />;
  }

  return (
    <Flex justifyContent="center" alignItems="center" minH="100vh">
      {showRegisterForm ? (
        <RegisterForm back={() => setShowRegisterForm(false)} />
      ) : (
        <LoginForm createAccount={() => setShowRegisterForm(true)} />
      )}
    </Flex>
  );
};

export default Index;
