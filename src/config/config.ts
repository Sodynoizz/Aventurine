import { WarpStrategy, StarlightRefund } from '../types/warp'

class DefaultConfig {
  version: string
  description: string
  cacheFile: string
  refundMode: StarlightRefund
  readFromCache: boolean
  strategy: WarpStrategy
  warpsSimulation: number
  savePullsRecord: boolean
  saveWarpsPlanRecord: boolean

  constructor() {
    this.version = '3.4 Pulls Plan For Honkai Star Rail'
    this.description = 'Tribbie e1s0 & Sunday e1s1'
    this.cacheFile = 'resources/pulls_record.json'
    //TODO: Handle Error From Cache
    this.readFromCache = false// TODO: Handle error

    // Warps Configuration
    this.warpsSimulation = 100000 // Default warp simulation count
    this.strategy = WarpStrategy.E0 // Default pull strategy

    // Records
    this.savePullsRecord = false
    this.saveWarpsPlanRecord = false
  }
}

export default DefaultConfig
