import { Flex, type FlexProps } from "./Flex"

export function VStack({ children, ...props }: FlexProps) {
  return (
    <Flex direction="column" {...props}>
      {children}
    </Flex>
  )
}
