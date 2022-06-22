import { Anchor, Text } from "@incmix/ui";

import { ContextualNavLink } from "@/components/ContextualNav";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";

export default function Changelog() {
  const previousLink: ContextualNavLink = {
    href: "/docs/getting-started",
    label: "Installation",
  };

  const nextLink: ContextualNavLink = {
    href: "/docs/features/style-props",
    label: "Style props",
  };

  return (
    <PageLayout previousLink={previousLink} nextLink={nextLink}>
      <PageTitle>Changelog</PageTitle>
      <Text>
        All notable changes of the current major version are described in the{" "}
        <Anchor
          href="https://github.com/incmixlabs/incmix/blob/main/packages/ui/CHANGELOG.md"
          external
          color="$primary11"
          fontWeight="$semibold"
        >
          CHANGELOG.md
        </Anchor>{" "}
        file.
      </Text>
    </PageLayout>
  );
}
