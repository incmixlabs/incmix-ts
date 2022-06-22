import { Heading, HTMLIncmixProps } from "@incmix/ui";

export default function SectionTitle(props: HTMLIncmixProps<"h2">) {
  return <Heading as="h2" size="2xl" mb="$4" {...props} />;
}
