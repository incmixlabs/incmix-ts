import { ElementType, Text, TextProps } from "@incmix/ui";

export default function MainNavSubtitle<C extends ElementType = "p">(
  props: TextProps<C>
) {
  return (
    <Text
      as="span"
      color="$primary10"
      fontSize="$xs"
      fontWeight="$semibold"
      textTransform="uppercase"
      {...props}
    />
  );
}
