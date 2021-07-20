import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import React from 'react';

import UserService, { IRegisterPayload } from 'src/services/User';
import useAuth from 'src/context/auth';

interface IProps {
  back: () => void;
}

const RegisterForm = ({ back }: IProps): JSX.Element => {
  const { refresh } = useAuth();
  const toast = useToast();

  const onSubmit = async (values: IRegisterPayload) => {
    if (await UserService.register(values)) {
      refresh();
    } else {
      toast({
        status: 'error',
        description: 'Please try again soon',
        title: 'Error',
      });
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        name: '',
        password: '',
      }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form autoComplete="on">
          <Flex direction="column">
            <Heading color="teal.500">Create an account</Heading>
            <Field name="username">
              {({ field, form }: FieldProps) => (
                <FormControl mt={4} isInvalid={!!(form.errors.username && form.touched.username)}>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input {...field} id="username" placeholder="username..." />
                  <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="name">
              {({ field, form }: FieldProps) => (
                <FormControl mt={4} isInvalid={!!(form.errors.name && form.touched.name)}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input {...field} id="name" placeholder="name..." />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field, form }: FieldProps) => (
                <FormControl mt={4} isInvalid={!!(form.errors.password && form.touched.password)}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    {...field}
                    id="password"
                    placeholder="password..."
                    type="password"
                    autoComplete="new-password"
                  />
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
              Submit
            </Button>

            <Button onClick={back} variant="link" mt={4} colorScheme="teal">
              Already have an account? Login
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
