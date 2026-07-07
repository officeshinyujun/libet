import { Flex, type FlexProps } from "./Flex"

export function HStack({ children, ...props }: FlexProps) {
  return (
    <Flex direction="row" {...props}>
      {children}
    </Flex>
  )
}
