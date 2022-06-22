import { GoogleMap, Text } from "@incmix/ui";
import Prism from "prismjs";
import { onMount } from "solid-js";

import Code from "@/components/Code";
import CodeSnippet from "@/components/CodeSnippet";
import { ContextualNavLink } from "@/components/ContextualNav";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { Preview } from "@/components/Preview";
import { PropsTable, PropsTableItem } from "@/components/PropsTable";
import SectionTitle from "@/components/SectionTitle";

import { snippets } from "./snippets";

export default function GoogleMapsDoc() {
  const previousLink: ContextualNavLink = {
    href: "/docs/others/close-button",
    label: "CloseButton",
  };

  const contextualNavLinks: ContextualNavLink[] = [
    { href: "#import", label: "Import" },
    { href: "#usage", label: "Usage" },
    { href: "#props", label: "Props" },
  ];

  const propItems: PropsTableItem[] = [
    {
      name: "onClick",
      description: "Callback when the map is clicked.",
      type: "function",
    },
    {
      name: "onIdle",
      description: "The callback to fire when the map becomes idle.",
      type: "function",
    },
    {
      name: "children",
      description: "Markers and Overlays that can be passed into a Map.",
      type: "JSX.Element",
    },
    {
      name: "googleMapsProps",
      description:
        "All other props that can be initialized with the google map LoaderOptions eg apiKey, channel. https://developers.google.com/maps/documentation/javascript/tutorial",
      type: "Object",
      defaultValue: `{ center: { lat: 0, lng: 0 }, zoom: 4, autoFit: true,}`,
    },
  ];

  onMount(() => {
    Prism.highlightAll();
  });

  return (
    <PageLayout
      previousLink={previousLink}
      contextualNavLinks={contextualNavLinks}
    >
      <PageTitle>GoogleMaps</PageTitle>
      <Text mb="$5">
        <Code>GoogleMaps</Code> offers a wrapper to easily instantiate a
        GoogleMap in your UI. It offers a set of primitives to also enhance the
        map with overlays, markers, etc.
      </Text>
      <SectionTitle id="import">Import</SectionTitle>
      <CodeSnippet snippet={snippets.importComponent} mb="$12" />
      <SectionTitle id="usage">Usage</SectionTitle>
      <Preview snippet={snippets.basicUsage} mb="$12">
        <GoogleMap.Wrapper apiKey="">
          <GoogleMap
            googleMapsProps={{ center: { lat: 53.551086, lng: 9.993682 } }}
          >
            <GoogleMap.Marker position={{ lat: 53.551086, lng: 9.993682 }} />
            <GoogleMap.Marker position={{ lat: 52.520008, lng: 13.404954 }} />
          </GoogleMap>
        </GoogleMap.Wrapper>
      </Preview>
      <PropsTable items={propItems} />
    </PageLayout>
  );
}
