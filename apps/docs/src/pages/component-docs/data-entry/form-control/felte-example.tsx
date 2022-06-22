import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-yup";
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  SimpleOption,
  SimpleSelect,
  Textarea,
  VStack,
} from "@incmix/ui";
import { For, Show } from "solid-js";
import type { InferType } from "yup";
import { boolean, mixed, object, string } from "yup";

const schema = object({
  email: string().email().required(),
  jobTitle: string().required(),
  gender: mixed().oneOf(["male", "female", "other"]).required(),
  bio: string().max(30),
  subscribe: boolean(),
});

export function FelteExample() {
  const { form, errors, data, isValid, setFields } = createForm<
    InferType<typeof schema>
  >({
    extend: validator({ schema }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <VStack
      as="form"
      ref={form}
      spacing="$5"
      alignItems="stretch"
      maxW="$96"
      mx="auto"
    >
      <FormControl required invalid={!!errors("email")}>
        <FormLabel>Email</FormLabel>
        <Input type="email" name="email" placeholder="contact@incmix-ui.com" />
        <FormErrorMessage>{errors("email")[0]}</FormErrorMessage>
      </FormControl>
      <FormControl required invalid={!!errors("jobTitle")}>
        <FormLabel>Job title</FormLabel>
        <SimpleSelect
          placeholder="Choose a job title"
          onChange={(value) => setFields("jobTitle", value)}
        >
          <For
            each={[
              "Designer",
              "Frontend developer",
              "Backend developer",
              "Devops",
            ]}
          >
            {(item) => <SimpleOption value={item}>{item}</SimpleOption>}
          </For>
        </SimpleSelect>
        <FormErrorMessage>{errors("jobTitle")[0]}</FormErrorMessage>
      </FormControl>
      <FormControl as="fieldset" required invalid={!!errors("gender")}>
        <FormLabel as="legend">Gender</FormLabel>
        <RadioGroup name="gender">
          <HStack spacing="$5">
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="other">Other</Radio>
          </HStack>
        </RadioGroup>
        <FormErrorMessage>{errors("gender")[0]}</FormErrorMessage>
      </FormControl>
      <FormControl invalid={!!errors("bio")}>
        <FormLabel>Bio</FormLabel>
        <Textarea name="bio" placeholder="Tell us something about yourself" />
        <Show
          when={errors("bio")}
          fallback={
            <FormHelperText w="$full" textAlign="end">
              {data("bio")?.length ?? 0}/30
            </FormHelperText>
          }
        >
          <FormErrorMessage>{errors("bio")[0]}</FormErrorMessage>
        </Show>
      </FormControl>
      <Checkbox name="subscribe">Subscribe to the newsletter</Checkbox>
      <HStack justifyContent="flex-end">
        <Button type="submit" disabled={!isValid()}>
          Submit
        </Button>
      </HStack>
    </VStack>
  );
}
