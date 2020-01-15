import React from "react";
import styled from "styled-components";
import useForm from "react-hook-form";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useSelector } from "react-redux";

import TextInput from "#root/components/shared/TextInput";
import Textarea from "#root/components/shared/Textarea";

const Form = styled.form`
  background-color: ${props => props.theme.whiteSmoke};
  margin-top: 1rem;
  padding: 1rem;
`;

const Label = styled.label`
  display: block;

  :not(:first-child) {
    margin-top: 0.5rem;
  }
`;

const LabelText = styled.strong`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  margin-top: 0.5rem;
  display: block;
`;

const mutation = gql`
  mutation($description: String!, $title: String!) {
    createListing(description: $description, title: $title) {
      id
    }
  }
`;

function AddListing({ onAddListing }) {
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm();
  const [createListing] = useMutation(mutation);
  const session = useSelector(state => state.session);

  if (!session) {
    return <p>Login to add listing</p>;
  }

  const onSubmit = handleSubmit(async ({ description, title }) => {
    await createListing({ variables: { description, title } });
    reset();
    onAddListing();
  });

  return (
    <Form onSubmit={onSubmit}>
      <Label>
        <LabelText>Title</LabelText>
        <TextInput
          disabled={isSubmitting}
          name="title"
          ref={register}
          type="text"
        />
      </Label>
      <Label>
        <LabelText>Description</LabelText>
        <Textarea disabled={isSubmitting} name="description" ref={register} />
      </Label>
      <Button disabled={isSubmitting} type="submit">
        Add Listing
      </Button>
    </Form>
  );
}

export default AddListing;
