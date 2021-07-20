import { Button, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';

import useAuth from 'src/context/auth';
import UserService from 'src/services/User';

const Navbar = (): JSX.Element => {
  const { name, refresh } = useAuth();
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 3 }}>
      <nav>
        <Flex
          bg="white"
          opacity={0.95}
          left={0}
          right={0}
          justifyContent="flex-end"
          px={[4, 12]}
          py={4}
          alignItems="center"
          w={'100%'}
        >
          <Link href="/" mr="auto">
            Todo List
          </Link>
          <Text>{name}</Text>
          <Button
            variant="link"
            colorScheme="red"
            ml={2}
            onClick={async () => {
              await UserService.logout();
              refresh();
            }}
          >
            Logout
          </Button>
        </Flex>
      </nav>
    </header>
  );
};

export default Navbar;
