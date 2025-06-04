import { StarlightRefund } from "../types/constant"

class DefaultConfig {
  version: string
  description: string
  cacheFile: string
  refundMode: StarlightRefund
  readFromCache: boolean
  saveRecord: boolean

  constructor() {
    this.version = "3.4 Pulls Plan For Honkai Star Rail"
    this.description = "Tribbie e1s0 & Sunday e1s1"
    this.cacheFile = "resources/pulls_record.json"
    this.refundMode = StarlightRefund.REFUND_AVG
    this.readFromCache = true // TODO: Handle error
    this.saveRecord = false
  }
}

export default DefaultConfig
