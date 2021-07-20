import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import React from 'react';

import ProjectService, { CreateProjectPayload } from '../services/Project';

interface IProps {
  refetch: () => void;
}

const CreateProjectForm = ({ refetch }: IProps): JSX.Element => {
  const onSubmit = async (
    values: CreateProjectPayload,
    formik: FormikHelpers<CreateProjectPayload>
  ) => {
    await ProjectService.createProject(values);
    refetch();
    formik.resetForm();
  };

  return (
    <Formik
      initialValues={{
        name: '',
      }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          <Flex direction="column" shadow="md" bg="gray.100" p={8}>
            <Field name="name">
              {({ field, form }: FieldProps) => (
                <FormControl isInvalid={!!(form.errors.name && form.touched.name)}>
                  <FormLabel htmlFor="name">Create a new project</FormLabel>
                  <Input bg="white" {...field} id="name" placeholder="Project name" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
              Create Project
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default CreateProjectForm;
