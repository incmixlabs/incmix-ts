import { Heading, HTMLIncmixProps } from "@incmix/ui";

export default function PageTitle(props: HTMLIncmixProps<"h1">) {
  return <Heading as="h1" size="3xl" fontWeight="$bold" mb="$6" {...props} />;
}
