

export interface Pulls {
  stellarJades: number
  oneiricShards: number
  vouchers: number
  starlightShop: number
  emberShop: number
  specialPass: number
  initialPulls: number
}

export interface WarpsPlan {
  pulls: number,
  pityCharacter: number,
  pityLightCone: number,
  guaranteedCharacter: boolean,
  guaranteedLightCone: boolean,
  currentEilodonLevel: number,
  currentSuperimpositionLevel: number
}

export enum WarpStrategy {
  E0 = 0, // E0 -> S1 -> E6 -> S5
  E1 = 1, // E1 -> S1 -> E6 -> S5
  E2 = 2, // E2 -> S1 -> E6 -> S5
  E3 = 3, // E3 -> S1 -> E6 -> S5
  E4 = 4, // E4 -> S1 -> E6 -> S5
  E5 = 5, // E5 -> S1 -> E6 -> S5
  E6 = 6, // E6 -> S1 -> S5
  S1 = 7, // S1 -> E6 -> S5
}

export enum WarpType {
  CHARACTER,
  LIGHTCONE
}

export type WarpMilestone = {
  warpType: WarpType
  label: string
  pity: number
  guaranteed: boolean
  redistributedCumulative: number[]
  redistributedCumulativeNonPity?: number[]
  warpCap: number
}

export type WarpMilestoneResult = { warps: number, wins: number }


export enum StarlightRefund {
  REFUND_NONE = 'REFUND_NONE',
  REFUND_LOW = 'REFUND_LOW',
  REFUND_AVG = 'REFUND_AVG',
  REFUND_HIGH = 'REFUND_HIGH',
}

export const StarlightMultiplier: Record<StarlightRefund, number> = {
  [StarlightRefund.REFUND_NONE]: 0.00,
  [StarlightRefund.REFUND_LOW]: 0.04,
  [StarlightRefund.REFUND_AVG]: 0.075,
  [StarlightRefund.REFUND_HIGH]: 0.11,
}
