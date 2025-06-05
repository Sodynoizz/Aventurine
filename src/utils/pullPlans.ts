import DefaultConfig from '../config/config'
import { Pulls, StarlightMultiplier } from '../types/warp'

class PullsPlan {
  stellarJades: number
  oneiricShards: number
  vouchers: number
  starlightShop: number
  emberShop: number
  specialPass: number
  config: DefaultConfig
  pityCharacter: number
  pityLightCone: number

  constructor(
    stellarJades: number,
    oneiricShards: number,
    vouchers: number,
    starlightShop: number,
    emberShop: number,
    specialPass: number,
  ) {
    this.stellarJades = stellarJades
    this.oneiricShards = oneiricShards
    this.vouchers = vouchers
    this.starlightShop = starlightShop
    this.emberShop = emberShop
    this.specialPass = specialPass
    this.config = new DefaultConfig()
  }

  calculateAllPullsWithRefunds(totalPulls: number): Record<string, number> {
    const refunds: Record<string, number> = {}

    for (const mode in StarlightMultiplier) {
      if (Object.prototype.hasOwnProperty.call(StarlightMultiplier, mode)) {
        const multiplier =
          StarlightMultiplier[mode as keyof typeof StarlightMultiplier]
        refunds[mode] = Math.floor(multiplier * totalPulls) + totalPulls
      }
    }

    return refunds
  }

  calculateInitialPulls(): number {
    const totalJades =
      this.stellarJades + this.oneiricShards + this.vouchers * 90
    let initialPulls = Math.floor(this.emberShop / 90) > 5 ? 5 : 0

    initialPulls +=
      Math.floor(totalJades / 160) +
      Math.floor(this.starlightShop / 20) +
      this.specialPass

    return initialPulls
  }

  toJSON(): Pulls {
    return {
      stellarJades: this.stellarJades,
      oneiricShards: this.oneiricShards,
      vouchers: this.vouchers,
      starlightShop: this.starlightShop,
      emberShop: this.emberShop,
      specialPass: this.specialPass,
      initialPulls: this.calculateInitialPulls(),
    }
  }
}

export default PullsPlan
