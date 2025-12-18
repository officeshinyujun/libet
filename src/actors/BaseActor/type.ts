/**
 * 모든 Actor의 공통 베이스 타입
 *
 * 월드에 배치되는 모든 객체(Map, Character, Pawn 등)는
 * 이 타입을 확장하여 위치/회전/스케일 정보를 공유한다.
 */
export type BaseActorType = {
  /** Actor 고유 이름 (씬 트리 및 디버깅용) */
  name: string

  /** Actor 분류용 태그 목록 (검색, 필터링, 시스템 처리용) */
  tags: string[]

  /** 월드 스케일 (x, y, z) */
  scale: [number, number, number]

  /** 월드 회전값 (radian 단위) */
  rotation: [number, number, number]

  /** 월드 위치 좌표 */
  position: [number, number, number]
}
