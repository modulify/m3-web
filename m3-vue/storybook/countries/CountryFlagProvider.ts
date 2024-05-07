import type { DefineComponent, SVGAttributes } from 'vue'
import type { Code } from './codes'

import ad from 'flag-icons/flags/1x1/ad.svg'
import am from 'flag-icons/flags/1x1/am.svg'
import by from 'flag-icons/flags/1x1/by.svg'
import ch from 'flag-icons/flags/1x1/ch.svg'
import cn from 'flag-icons/flags/1x1/cn.svg'
import de from 'flag-icons/flags/1x1/de.svg'
import fi from 'flag-icons/flags/1x1/fi.svg'
import fr from 'flag-icons/flags/1x1/fr.svg'
import gb from 'flag-icons/flags/1x1/gb.svg'
import ge from 'flag-icons/flags/1x1/ge.svg'
import kg from 'flag-icons/flags/1x1/kg.svg'
import kz from 'flag-icons/flags/1x1/kz.svg'
import ru from 'flag-icons/flags/1x1/ru.svg'
import ua from 'flag-icons/flags/1x1/ua.svg'
import us from 'flag-icons/flags/1x1/us.svg'

type FlagSprite = DefineComponent<SVGAttributes, unknown, unknown>

export class CountryFlagProvider {
  private _sprites: Map<Code, FlagSprite> = new Map()

  has (code: Code): boolean {
    return this._sprites.has(code)
  }

  get (code: Code): FlagSprite {
    if (!this.has(code)) {
      throw new Error('Code ' + code + ' has not been registered yet')
    }

    return this._sprites.get(code) as FlagSprite
  }

  add (code: Code, sprite: FlagSprite): void {
    if (this.has(code)) {
      throw new Error('Code ' + code + ' has been already registered')
    }

    this._sprites.set(code, sprite)
  }
}

const provider = new CountryFlagProvider()

provider.add('ad', ad)
provider.add('am', am)
provider.add('by', by)
provider.add('ch', ch)
provider.add('cn', cn)
provider.add('de', de)
provider.add('fi', fi)
provider.add('fr', fr)
provider.add('gb', gb)
provider.add('ge', ge)
provider.add('kg', kg)
provider.add('kz', kz)
provider.add('ru', ru)
provider.add('ua', ua)
provider.add('us', us)

export default provider