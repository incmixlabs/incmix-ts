import { Alert, AlertDescription, Anchor, incmix, Text } from "@incmix/ui";
import Prism from "prismjs";
import { Link } from "solid-app-router";
import { onMount } from "solid-js";

import Code from "@/components/Code";
import CodeSnippet from "@/components/CodeSnippet";
import { ContextualNavLink } from "@/components/ContextualNav";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { Preview } from "@/components/Preview";
import SectionSubtitle from "@/components/SectionSubtitle";
import SectionTitle from "@/components/SectionTitle";

import { snippets } from "./snippets";

export default function IncmixFactory() {
  const previousLink: ContextualNavLink = {
    href: "/docs/features/global-styles",
    label: "Global styles",
  };

  const nextLink: ContextualNavLink = {
    href: "/docs/theming/default-theme",
    label: "Default theme",
  };

  const contextualNavLinks: ContextualNavLink[] = [
    { href: "#incmix-jsx-elements", label: "Incmix JSX elements" },
    { href: "#incmix-factory-function", label: "Incmix factory function" },
  ];

  onMount(() => {
    Prism.highlightAll();
  });

  return (
    <PageLayout
      previousLink={previousLink}
      nextLink={nextLink}
      contextualNavLinks={contextualNavLinks}
    >
      <PageTitle>Incmix factory</PageTitle>
      <Text mb="$5">
        Incmix factory serves as an{" "}
        <strong>object of incmix enabled JSX elements</strong>, and also a{" "}
        <strong>function that can be used to enable custom component</strong>{" "}
        receive incmix's style props.
      </Text>
      <CodeSnippet snippet={snippets.importIncmixFactory} mb="$12" />
      <SectionTitle id="incmix-jsx-elements">Incmix JSX elements</SectionTitle>
      <Text mb="$5">
        Create base html elements with theme-aware style props using{" "}
        <Code>incmix.&lt;element&gt;</Code> notation. For example, if you want a
        plain html button with ability to pass Incmix UI styles, you can write{" "}
        <Code>&lt;incmix.button /&gt;</Code>.
      </Text>
      <Preview snippet={snippets.incmixJsxElements} mb="$5">
        <incmix.button
          px="$3"
          py="$2"
          bg="$success7"
          rounded="$md"
          _hover={{ bg: "$success8" }}
        >
          Click me
        </incmix.button>
      </Preview>
      <Text mb="$8">
        This reduces the need to create custom component wrappers and name them.
        This syntax is available for any html elements.
      </Text>
      <SectionTitle id="incmix-factory-function">
        Incmix factory function
      </SectionTitle>
      <Text mb="$5">
        This is a function that converts <strong>non-incmix components</strong>{" "}
        or <strong>jsx element</strong> to incmix-enabled components so you can
        pass style props to them.
      </Text>
      <Text mb="$5">
        Consider the <Code>Link</Code> component of the{" "}
        <Code>solid-app-router</Code> package, let's use the incmix factory
        function to make possible to pass style props to it.
      </Text>
      <CodeSnippet snippet={snippets.incmixFactoryFunction} mb="$5" />
      <Alert status="warning" mb="$10">
        <AlertDescription>
          Considering that Incmix UI uses <Code>stitches</Code> under the hood,
          ensure the non-incmix component accepts <Code>class</Code> as props
          for this to work correctly
        </AlertDescription>
      </Alert>
      <SectionSubtitle>Attaching styles</SectionSubtitle>
      <Text mb="$5">
        In some instances, you might need to attach specific styles to the
        component wrapped in the incmix factory
      </Text>
      <CodeSnippet snippet={snippets.attachingStyles} mb="$8" />
      <Text mb="$5">
        You can also use the incmix factory on jsx elements as well.
      </Text>
      <CodeSnippet snippet={snippets.attachingStylesJsxElement} mb="$5" />
      <Text mb="$5">
        The <strong>baseClass</strong> property is the CSS class to use when
        targeting this component in a css selector. This class will be applied
        to the rendered dom element.
      </Text>
      <Text>
        Taking the above example, in stitches <Code>css()</Code> method or
        Incmix UI <Code>css</Code> prop, if you want to target all{" "}
        <Code>p</Code> in the <Code>Card</Code> component you can use the css
        selector <Code>{"${Card} p"}</Code> and it will evaluate to{" "}
        <Code>{".my-card p"}</Code>. If you want to learn more, check out
        "Targeting other SolidJS components" in the{" "}
        <Anchor
          as={Link}
          href="/docs/features/css-prop#targeting-other-solid-components"
          color="$primary11"
          fontWeight="$semibold"
        >
          css prop
        </Anchor>{" "}
        documentation.
      </Text>
    </PageLayout>
  );
}
