import {
  Box,
  Grid,
  GridItem,
  GridProps,
  HStack,
  incmix,
  SystemConfig,
  useTheme,
  VStack,
} from "@incmix/ui";
import { For, splitProps } from "solid-js";

export interface ColorScaleItem {
  name: string;
  token: keyof SystemConfig["theme"]["colors"];
}

type ColorScaleProps = GridProps & {
  scale: ColorScaleItem[];
};

export function ColorScale(props: ColorScaleProps) {
  const theme = useTheme();
  const [local, others] = splitProps(props, ["scale"]);

  return (
    <Grid
      templateColumns={{
        "@initial": "repeat(2, minmax(0, 1fr))",
        "@md": "repeat(3, minmax(0, 1fr))",
      }}
      gap="$6"
      {...others}
    >
      <For each={local.scale}>
        {(item) => (
          <GridItem>
            <HStack spacing="$3">
              <Box
                boxSize={{ "@initial": "$10", "@sm": "$12" }}
                rounded="$md"
                shadow="$inner"
                bg={theme().colors[item.token].value}
              />
              <VStack alignItems="flex-start">
                <incmix.span fontSize="$sm" fontWeight="$semibold">
                  {item.name}
                </incmix.span>
                <incmix.span fontSize="$sm" textTransform="uppercase">
                  {theme().colors[item.token].value}
                </incmix.span>
              </VStack>
            </HStack>
          </GridItem>
        )}
      </For>
    </Grid>
  );
}
