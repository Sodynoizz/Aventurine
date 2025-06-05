import DefaultConfig from '../config/config'
import { EidolonLevel, SuperimpositionLevel } from '../data/gameplay'
import {
  character5050,
  characterCumulative,
  characterDistribution,
  characterWarpCap,
  lightcone5050,
  lightconeCumulative,
  lightconeDistribution,
  lightconeWarpCap,
} from '../data/warp'
import {
  WarpMilestone,
  WarpMilestoneResult,
  WarpStrategy,
  WarpType,
} from '../types/warp'

class WarpsCalculator {
  pulls: number
  pityCharacter: number
  pityLightCone: number
  guaranteedCharacter: boolean
  guaranteedLightCone: boolean
  currentEidolonLevel: number
  currentSuperimpositionLevel: number
  config: DefaultConfig

  constructor(
    pulls: number,
    pityCharacter: number,
    pityLightCone: number,
    guaranteedCharacter: boolean,
    guaranteedLightCone: boolean,
    currentEidolonLevel: number,
    currentSuperimpositionLevel: number
  ) {
    this.pulls = pulls
    this.pityCharacter = pityCharacter
    this.pityLightCone = pityLightCone
    this.guaranteedCharacter = guaranteedCharacter
    this.guaranteedLightCone = guaranteedLightCone
    this.currentEidolonLevel = currentEidolonLevel
    this.currentSuperimpositionLevel = currentSuperimpositionLevel
    this.config = new DefaultConfig()
  }

  simulateWarps(): Record<string, WarpMilestoneResult> {
    const milestones = this.generateWarpMilestones()

    const milestonesResults: Record<string, WarpMilestoneResult> =
      Object.fromEntries(
        milestones.map(({ label }) => [label, { warps: 0, wins: 0 }])
      )

    for (let i = 0; i < this.config.warpsSimulation; i++) {
      let count = 0

      for (const milestone of milestones) {
        const rate =
          milestone.warpType === WarpType.CHARACTER
            ? character5050
            : lightcone5050
        const idx = this.getNextSuccessIndex(
          milestone.redistributedCumulative,
          milestone.warpCap,
          milestone.pity
        )

        if (Math.random() < rate || milestone.guaranteed) count += idx
        else {
          const new_idx =
            this.getNextSuccessIndex(
              milestone.redistributedCumulativeNonPity ??
                milestone.redistributedCumulative,
              milestone.warpCap,
              0
            ) + 1

          count += idx + new_idx
        }

        milestonesResults[milestone.label].warps += count
        if (count <= this.pulls) {
          milestonesResults[milestone.label].wins++
        }
      }
    }

    for (const milestone of milestones) {
      milestonesResults[milestone.label].warps /= this.config.warpsSimulation
      milestonesResults[milestone.label].wins /= this.config.warpsSimulation
    }

    return milestonesResults
  }

  generateWarpMilestones(): WarpMilestone[] {
    const e0CharDist = this.redistributePityCumulative(
      this.pityCharacter,
      characterWarpCap,
      characterDistribution
    )
    const e0CharDistNonPity = this.redistributePityCumulative(
      0,
      characterWarpCap,
      characterDistribution
    )
    const s1LcDist = this.redistributePityCumulative(
      this.pityLightCone,
      lightconeWarpCap,
      lightconeDistribution
    )
    const s1LcDistNonPity = this.redistributePityCumulative(
      0,
      lightconeWarpCap,
      lightconeDistribution
    )

    let milestones: WarpMilestone[] = [
      {
        warpType: WarpType.CHARACTER,
        label: 'E0',
        guaranteed: this.guaranteedCharacter,
        pity: this.pityCharacter,
        redistributedCumulative: e0CharDist,
        redistributedCumulativeNonPity: e0CharDistNonPity,
        warpCap: characterWarpCap,
      },
      ...['E1', 'E2', 'E3', 'E4', 'E5', 'E6'].map((label) => ({
        warpType: WarpType.CHARACTER,
        label,
        guaranteed: false,
        pity: 0,
        redistributedCumulative: characterCumulative,
        warpCap: characterWarpCap,
      })),
      ...['S2', 'S3', 'S4', 'S5'].map((label) => ({
        warpType: WarpType.LIGHTCONE,
        label,
        guaranteed: false,
        pity: 0,
        redistributedCumulative: lightconeCumulative,
        warpCap: lightconeWarpCap,
      })),
    ]

    const s1Milestone: WarpMilestone = {
      warpType: WarpType.LIGHTCONE,
      label: 'S1',
      guaranteed: this.guaranteedLightCone,
      pity: this.pityLightCone,
      redistributedCumulative: s1LcDist,
      redistributedCumulativeNonPity: s1LcDistNonPity,
      warpCap: lightconeWarpCap,
    }

    const strategyIndexMap: Record<WarpStrategy, number> = {
      [WarpStrategy.S1]: 0,
      [WarpStrategy.E0]: 1,
      [WarpStrategy.E1]: 2,
      [WarpStrategy.E2]: 3,
      [WarpStrategy.E3]: 4,
      [WarpStrategy.E4]: 5,
      [WarpStrategy.E5]: 6,
      [WarpStrategy.E6]: 7,
    }

    const insertIdx = strategyIndexMap[this.config.strategy]
    milestones.splice(insertIdx, 0, s1Milestone)

    const currentEilodonCheck =
      this.currentEidolonLevel !== EidolonLevel.NONE ||
      this.currentSuperimpositionLevel !== SuperimpositionLevel.NONE

    milestones = currentEilodonCheck
      ? this.filterRemapMilestones(milestones)
      : milestones

    let e = this.currentEidolonLevel
    let s = this.currentSuperimpositionLevel

    for (const milestone of milestones) {
      if (milestone.warpType === WarpType.CHARACTER) e++
      if (milestone.warpType === WarpType.LIGHTCONE) s++
      milestone.label = e == EidolonLevel.NONE ? `S${s}` : `E${e}S${s}`
    }

    return milestones
  }

  filterRemapMilestones(milestones: WarpMilestone[]): WarpMilestone[] {
    let skipCharacter = this.currentEidolonLevel
    let skipLightCone = this.currentSuperimpositionLevel

    const filtered = milestones.filter((milestone) => {
      if (milestone.warpType === WarpType.CHARACTER && skipCharacter > -1) {
        skipCharacter--
        return false
      }
      if (milestone.warpType === WarpType.LIGHTCONE && skipLightCone > 0) {
        skipLightCone--
        return false
      }
      return true
    })

    // Remap the new starting milestone
    const e0CharDist = this.redistributePityCumulative(
      this.pityCharacter,
      characterWarpCap,
      characterDistribution
    )
    const e0CharDistNonPity = this.redistributePityCumulative(
      0,
      characterWarpCap,
      characterDistribution
    )
    const s1LcDist = this.redistributePityCumulative(
      this.pityLightCone,
      lightconeWarpCap,
      lightconeDistribution
    )
    const s1LcDistNonPity = this.redistributePityCumulative(
      0,
      lightconeWarpCap,
      lightconeDistribution
    )

    const firstCharIdx = filtered.findIndex(
      (m) => m.warpType === WarpType.CHARACTER
    )
    if (firstCharIdx >= 0) {
      filtered[firstCharIdx].pity = this.pityCharacter
      filtered[firstCharIdx].guaranteed = this.guaranteedCharacter
      filtered[firstCharIdx].redistributedCumulative = e0CharDist
      filtered[firstCharIdx].redistributedCumulativeNonPity = e0CharDistNonPity
    }

    const firstLcIdx = filtered.findIndex(
      (m) => m.warpType === WarpType.LIGHTCONE
    )
    if (firstLcIdx >= 0) {
      filtered[firstLcIdx].pity = this.pityLightCone
      filtered[firstLcIdx].guaranteed = this.guaranteedLightCone
      filtered[firstLcIdx].redistributedCumulative = s1LcDist
      filtered[firstLcIdx].redistributedCumulativeNonPity = s1LcDistNonPity
    }

    return filtered
  }

  redistributePityCumulative(
    pity: number,
    warpCap: number,
    distribution: number[]
  ): number[] {
    const redistributed = Array(warpCap).fill(0)
    for (let i = pity; i < warpCap; i++) {
      redistributed[i] =
        i === 0 ? distribution[i] : redistributed[i - 1] + distribution[i]
    }
    const diff = 1 - redistributed[warpCap - 1]
    for (let i = pity; i < warpCap; i++) {
      redistributed[i] += diff * distribution[i]
    }
    return redistributed
  }

  getNextSuccessIndex(
    cumulative: number[],
    warpCap: number,
    pity: number = 0
  ): number {
    const random = Math.random() * cumulative[warpCap - 1]
    return this.getIndex(random, cumulative, pity)
  }

  getIndex(random: number, cumulative: number[], pity: number = 0): number {
    let left = pity
    let right = cumulative.length - 1
    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      if (random > cumulative[mid]) {
        left = mid + 1
      } else {
        right = mid
      }
    }
    return left
  }

  toJSON() {
    return {
      pulls: this.pulls,
      pityCharacter: this.pityCharacter,
      pityLightCone: this.pityLightCone,
      guaranteedCharacter: this.guaranteedCharacter,
      guaranteedLightCone: this.guaranteedLightCone,
      currentEidolonLevel: this.currentEidolonLevel,
      currentSuperimpositionLevel: this.currentSuperimpositionLevel,
    }
  }
}

export default WarpsCalculator
