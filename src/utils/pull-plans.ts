import DefaultConfig from '../config/config'
import { PullsPlanData, StarlightMultiplier } from '../types/constant'

class PullsPlan {
  stellarJades: number
  oneiricShards: number
  vouchers: number
  starlightShop: number
  emberShop: number
  specialPass: number
  config: DefaultConfig

  constructor(
    stellarJades: number,
    oneiricShards: number,
    vouchers: number,
    starlightShop: number,
    emberShop: number,
    specialPass: number
  ) {
    this.stellarJades = stellarJades
    this.oneiricShards = oneiricShards
    this.vouchers = vouchers
    this.starlightShop = starlightShop
    this.emberShop = emberShop
    this.specialPass = specialPass
    this.config = new DefaultConfig()
  }

  calculateRefund(totalPulls: number): number {
    return Math.floor((StarlightMultiplier[this.config.refundMode] ?? 0) * totalPulls)
  }

  calculateTotalPulls(): number {
    const totalJades =
      this.stellarJades + this.oneiricShards + this.vouchers * 90
    let totalPulls = Math.floor(this.emberShop / 90) > 5 ? 5 : 0

    totalPulls +=
      Math.floor(totalJades / 160) +
      Math.floor(this.starlightShop / 20) +
      this.specialPass
    totalPulls += this.calculateRefund(totalPulls)

    return totalPulls
  }

  toJSON(): PullsPlanData {
    return {
      stellarJades: this.stellarJades,
      oneiricShards: this.oneiricShards,
      vouchers: this.vouchers,
      starlightShop: this.starlightShop,
      emberShop: this.emberShop,
      specialPass: this.specialPass,
      totalPulls: this.calculateTotalPulls(),
    }
  }
}

export default PullsPlan
