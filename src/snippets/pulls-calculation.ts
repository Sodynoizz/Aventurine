import { readFileSync, writeFileSync } from 'fs'
import { question, questionInt } from 'readline-sync'

import DefaultConfig from '../config/config'
import PullsPlan from '../utils/pullPlans'

class PullsCalculation {
  config: DefaultConfig
  pullsPlan: PullsPlan | null

  constructor() {
    this.config = new DefaultConfig()
    this.pullsPlan = null
  }

  readCache(): boolean {
    try {
      const data = readFileSync(this.config.cacheFile, 'utf8')
      const record = JSON.parse(data)

      this.pullsPlan = new PullsPlan(
        record.stellarJades,
        record.oneiricShards,
        record.vouchers,
        record.starlightShop,
        record.emberShop,
        record.specialPass,
      )

      console.log('Cached Record: ', record)
      return true
    } catch (err) {
      console.error('Error reading cache file: ', err)
      return false
    }
  }

  promptUser(): void {
    const stellarJades = questionInt('How many Stellar Jades do you have? : ')
    const oneiricShards = questionInt('How many Oneiric Shards do you have? : ')
    const vouchers = questionInt('How many vouchers days do you have left? : ')
    const starlightShop = questionInt('How many Undying Starlight do you have? : ')
    const emberShop = questionInt('How many Undying Ember do you have? : ')
    const specialPass = questionInt('How many Special Passes do you have? : ')
    const saveRecord = question('Do you want to save this record? (yes/no) : ')

    this.config.savePullsRecord = saveRecord.toLowerCase() === 'yes'
    this.pullsPlan = new PullsPlan(
      stellarJades,
      oneiricShards,
      vouchers,
      starlightShop,
      emberShop,
      specialPass,
    )
  }

  saveToCache(): void {
    const filePath = this.config.cacheFile
    writeFileSync(filePath, JSON.stringify(this.pullsPlan.toJSON(), null, 2))
    console.log(`Record saved to ${filePath}`)
  }

  summary(): void {
    if (this.pullsPlan) {
      const initialPulls = this.pullsPlan.calculateInitialPulls()
      const allRefunds = this.pullsPlan.calculateAllPullsWithRefunds(initialPulls)
      
      console.log('\n\n=-=-=-=-=-=- Pulls Plan Summary =-=-=-=-=-=-')
      console.log(this.config.version)
      console.log(this.config.description)
      console.table(allRefunds)
      
    }
  }

  async compile(): Promise<void> {
    if (this.config.readFromCache) {
      if (!this.readCache()) {
        return
      }
    } else {
      this.promptUser()
    }

    if (!this.pullsPlan) {
      return
    }

    if (this.config.savePullsRecord) {
      this.saveToCache()
    }    
    this.summary()
  }
}

const script = new PullsCalculation()
script.compile()
