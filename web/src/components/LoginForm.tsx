import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import React from 'react';

import UserService, { ILoginPayload } from 'src/services/User';
import useAuth from 'src/context/auth';

interface IProps {
  createAccount: () => void;
}

const LoginForm = ({ createAccount }: IProps): JSX.Element => {
  const { refresh } = useAuth();

  const onSubmit = async (values: ILoginPayload) => {
    if (await UserService.login(values)) {
      refresh();
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form autoComplete="on">
          <Flex direction="column">
            <Field name="username">
              {({ field, form }: FieldProps) => (
                <FormControl isInvalid={!!(form.errors.username && form.touched.username)}>
                  <FormLabel htmlFor="userame">Username</FormLabel>
                  <Input {...field} id="username" placeholder="username..." />
                  <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field, form }: FieldProps) => (
                <FormControl mt={4} isInvalid={!!(form.errors.password && form.touched.password)}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input {...field} id="password" placeholder="password..." type="password" />
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
              Login
            </Button>

            <Button onClick={createAccount} variant="link" mt={4} colorScheme="teal">
              Create an account
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
