import { Heading, HTMLIncmixProps } from "@incmix/ui";

export default function SectionSubtitle(props: HTMLIncmixProps<"h2">) {
  return <Heading as="h3" size="lg" mb="$3" {...props} />;
}
