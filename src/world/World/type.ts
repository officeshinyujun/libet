import * as React from "react"
import { CanvasProps } from "@react-three/fiber"

/**
 * World 컴포넌트 Props
 *
 * 게임 월드의 최상위 컨테이너로,
 * 렌더링(Canvas), 물리(Physics), 카메라, 환경 설정을 관리한다.
 *
 * 모든 Map, Character, Entity는 children으로 포함되어야 한다.
 */
export type WorldType = Omit<CanvasProps, 'children' | 'camera'> & {
  /**
   * 월드 내부에 배치될 엔티티들
   *
   * Map, Character, Item 등 모든 게임 오브젝트는
   * World의 children으로 렌더링된다.
   */
  children: React.ReactNode

  width?: string;
  height?: string;

  /**
   * 물리 엔진 전역 설정
   */
  physics?: {
    /**
     * 중력 벡터
     *
     * @default [0, -9.81, 0]
     */
    gravity?: [number, number, number]

    /**
     * 물리 시뮬레이션 디버그 렌더링 여부
     *
     * @default false
     */
    debug?: boolean

    /**
     * 물리 시뮬레이션 일시 정지 여부
     *
     * @default false
     */
    paused?: boolean
  }

  /**
   * 카메라 전역 설정
   *
   * World는 하나의 기본 카메라를 소유한다.
   */
  camera?: {
    /**
     * 카메라 타입
     *
     * @default "perspective"
     */
    type?: "perspective" | "orthographic"

    /** 카메라 위치 */
    position?: [number, number, number]

    /**
     * 시야각 (PerspectiveCamera 전용)
     *
     * @default 75
     */
    fov?: number

    /** Near clipping plane */
    near?: number

    /** Far clipping plane */
    far?: number
  }

  /**
   * 환경 및 배경 설정
   */
  environment?: {
    /**
     * 환경 프리셋
     *
     * drei Environment preset 사용
     */
    preset?: "sunset" | "dawn" | "night" | "warehouse" | "forest"

    /**
     * 환경을 배경으로 사용할지 여부
     *
     * @default true
     */
    background?: boolean
  }

  /**
   * 디버그 관련 옵션
   */
  debug?: {
    /** 물리 디버그 표시 */
    physics?: boolean

    /** 좌표축 헬퍼 표시 */
    axes?: boolean

    /** 성능 통계 표시 */
    stats?: boolean
  }

  /**
   * 월드 초기화 완료 시 호출
   */
  onReady?: () => void

  /**
   * 매 프레임 호출되는 루프 콜백
   *
   * @param delta 프레임 간 시간 (초 단위)
   */
  onTick?: (delta: number) => void
}
