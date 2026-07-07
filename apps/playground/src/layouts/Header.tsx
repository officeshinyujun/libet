import { useLocale } from "../i18n/context"
import { HStack } from "../components/HStack"
import type { PageId } from "../App"

export function Header({ currentPage: _ }: { currentPage: PageId }) {
  const { t, toggle } = useLocale()

  return (
    <header className="header">
      <a href="#" className="header-logo">libet</a>
      <HStack gap={8} align="center">
        <a href="https://github.com/yjshin/libet" target="_blank" rel="noopener noreferrer">{t("nav.github")}</a>
        <button className="lang-btn" onClick={toggle}>{t("nav.lang")}</button>
      </HStack>
    </header>
  )
}
