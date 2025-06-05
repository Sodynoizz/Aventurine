import { readFileSync, writeFileSync } from 'fs'
import { question, questionInt } from 'readline-sync'

import DefaultConfig from '../config/config'
import WarpsCalculator from '../utils/warpCalculator'

class WarpPlanner {
  config: DefaultConfig
  warpsPlan: WarpsCalculator | null

  constructor() {
    this.config = new DefaultConfig()
    this.warpsPlan = null
  }

  readCache(): boolean {
    try {
      const data = readFileSync(this.config.cacheFile, 'utf8')
      const record = JSON.parse(data)

      this.warpsPlan = new WarpsCalculator(
        record.pulls,
        record.pityCharacter,
        record.pityLightCone,
        record.guaranteedCharacter,
        record.guaranteedLightCone,
        record.currentEilodonLevel,
        record.currentSuperimpositionLevel
      )

      console.log('Cached Record: ', record)
      return true
    } catch (err) {
      console.error('Error reading cache file: ', err)
      return false
    }
  }

  promptUser(): void {
    const pulls = questionInt('How many pulls available do you have: ')
    const pityCharacter = questionInt('How many Character Pity do you have? : ')
    const pityLightCone = questionInt('How many Lightcone Pity do you have? : ')
    const guaranteedCharacter = question('Do you have a guaranteed character? (yes/no) : ').toLowerCase() === "yes"
    const guaranteedLightCone = question('Do you have a guaranteed lightcone? (yes/no) : ').toLowerCase() === "yes"
    const currentEilodonLevel = questionInt('What is your current Eilodon Level? (If NONE type -1) : ')
    const currentSuperimpositionLevel = questionInt('What is your current Superimposition Level? (If NONE type 0) : ')
    const saveRecord = question('Do you want to save this record? (yes/no) : ')

    this.config.saveWarpsPlanRecord = saveRecord.toLowerCase() === 'yes'
    this.warpsPlan = new WarpsCalculator(
      pulls,
      pityCharacter,
      pityLightCone,
      guaranteedCharacter,
      guaranteedLightCone,
      currentEilodonLevel,
      currentSuperimpositionLevel
    )

  }

  saveToCache(): void {
    const filePath = this.config.cacheFile
    writeFileSync(filePath, JSON.stringify(this.warpsPlan.toJSON(), null, 2))
    console.log(`Record saved to ${filePath}`)
  }

  summary(): void {
    if (this.warpsPlan) {
      const result = this.warpsPlan.simulateWarps()
      console.log('Warps Plan Summary:')
      console.table(result)
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

    if (!this.warpsPlan) {
      return
    }

    if (this.config.saveWarpsPlanRecord) {
      this.saveToCache()
    }    
    this.summary()
  }
}

const script = new WarpPlanner()
script.compile()
