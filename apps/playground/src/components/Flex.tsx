import { createElement, type ElementType, type ReactNode } from "react"

export interface FlexProps {
  as?: ElementType
  direction?: "row" | "column"
  justify?: "start" | "end" | "center" | "between" | "around"
  align?: "start" | "end" | "center" | "stretch"
  wrap?: "wrap" | "nowrap"
  gap?: number
  fullWidth?: boolean
  fullHeight?: boolean
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
}

const justifyMap: Record<string, string> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
}

const alignMap: Record<string, string> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
}

export function Flex({
  as,
  direction,
  justify,
  align,
  wrap,
  gap,
  fullWidth,
  fullHeight,
  children,
  className,
  style,
  ...rest
}: FlexProps) {
  return createElement(as || "div", {
    ...rest,
    className,
    style: {
      display: "flex",
      flexDirection: direction,
      justifyContent: justify ? justifyMap[justify] : undefined,
      alignItems: align ? alignMap[align] : undefined,
      flexWrap: wrap,
      gap: gap !== undefined ? `${gap}px` : undefined,
      width: fullWidth ? "100%" : undefined,
      height: fullHeight ? "100%" : undefined,
      ...style,
    } as React.CSSProperties,
  }, children)
}
