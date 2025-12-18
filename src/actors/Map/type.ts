import { BaseActorType } from "../BaseActor/type"
import * as THREE from "three"

/**
 * 월드 지형(Map) 타입
 *
 * 고정된 지형 또는 대형 구조물을 표현하며,
 * 물리 엔진 및 chunk 분할 옵션을 지원한다.
 */
export type MapType = BaseActorType & {
  /**
   * 맵에 사용할 3D 모델
   *
   * 보통 glTF.scene을 전달하며,
   * 물리 충돌 계산 시 기준이 된다.
   */
  modelpath: THREE.Group | THREE.Mesh | THREE.Object3D

  /** 사용자 시점 관련 메타 정보 (카메라 연동 등, 선택적) */
  userView?: string

  /**
   * 물리 엔진 적용 방식
   *
   * - "fixed": 고정된 충돌체 (지형, 바닥)
   * - "none": 물리 미적용
   *
   * @default "none"
   */
  physics?: "fixed" | "none"

  /**
   * 맵을 분할할 chunk 한 변의 크기
   *
   * world unit 기준이며,
   * isChunked가 true일 때 사용된다.
   *
   * @example
   * chunkSize={16}
   */
  chuckSize?: number

  /**
   * 맵을 chunk 단위로 분할할지 여부
   *
   * 대형 맵 성능 최적화를 위한 옵션
   *
   * @default false
   */
  isChunked?: boolean
}
