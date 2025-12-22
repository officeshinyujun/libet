import { BaseActorType } from "../BaseActor/type"
import * as THREE from "three"
import { ReactNode } from "react"

/**
 * 플레이어 또는 NPC 캐릭터 타입
 *
 * 이동, 점프, 입력 컨트롤러를 가지는 동적 Actor를 정의한다.
 */
export type CharacterType = BaseActorType & {
  /**
   * 캐릭터에 적용할 3D 모델
   *
   * 보통 glTF 로드 결과의 scene 또는 mesh를 사용한다.
   */
  modelpath?: THREE.Group | THREE.Mesh | THREE.Object3D

  /** 이동 속도 (world unit / second) */
  speed: number

  /** 점프 높이 (world unit 기준) */
  jumpHeight: number

  /** 추가 로직 또는 컴포넌트 */
  children?: ReactNode
}
