const importIncmixFactory = `import { incmix } from "@incmix/ui"`;

const incmixJsxElements = `<incmix.button 
  px="$3" 
  py="$2" 
  bg="$success7"
  rounded="$md" 
  _hover={{ bg: "$success8" }}
>
  Click me
</incmix.button>`;

const incmixFactoryFunction = `import { incmix } from "@incmix/ui"
import { Link } from "solid-app-router"

const IncmixLink = incmix(Link)

function Example() {
  return <IncmixLink href="#" bg="$danger3" fontSize="12px" />
}`;

const attachingStyles = `const IncmixLink = incmix(Link, {
  baseClass: "my-link",
  baseStyle: {
    color: "$primary9"
  }
})
`;

const attachingStylesJsxElement = `const Card = incmix("div", {
  baseClass: "my-card",
  baseStyle: {
    shadow: "$lg",
    rounded: "$lg",
    bg: "white",
  },
})`;

export const snippets = {
  importIncmixFactory,
  incmixJsxElements,
  incmixFactoryFunction,
  attachingStyles,
  attachingStylesJsxElement,
};
