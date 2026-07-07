import { useLocale } from "../i18n/context"
import { VStack } from "../components/VStack"
import { HStack } from "../components/HStack"

export function Home() {
  const { locale } = useLocale()

  if (locale === "ko") {
    return (
      <div className="home-hero">
        <VStack gap={16} align="center">
          <h1>libet</h1>
          <p>React Three Fiber 기반의 경량 3D 웹 게임 엔진입니다. 물리, 입력, 오디오, 애니메이션을 통합한 컴포넌트 기반 아키텍처를 제공합니다.</p>
          <HStack gap={12} wrap="wrap" justify="center">
            <span className="badge"><span>React 19</span></span>
            <span className="badge"><span>Three.js 0.182</span></span>
            <span className="badge"><span>Rapier Physics</span></span>
            <span className="badge"><span>TypeScript</span></span>
          </HStack>
        </VStack>
      </div>
    )
  }

  return (
    <div className="home-hero">
      <VStack gap={16} align="center">
        <h1>libet</h1>
        <p>A lightweight 3D web game engine built on React Three Fiber. Component-based architecture with integrated physics, input, audio, and animation systems.</p>
        <HStack gap={12} wrap="wrap" justify="center">
          <span className="badge"><span>React 19</span></span>
          <span className="badge"><span>Three.js 0.182</span></span>
          <span className="badge"><span>Rapier Physics</span></span>
          <span className="badge"><span>TypeScript</span></span>
        </HStack>
      </VStack>
    </div>
  )
}
