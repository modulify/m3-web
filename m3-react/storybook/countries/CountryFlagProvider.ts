import type {
  FC,
  SVGProps,
} from 'react'

import type { Code } from './codes'

import ad from 'flag-icons/flags/1x1/ad.svg?react'
import am from 'flag-icons/flags/1x1/am.svg?react'
import by from 'flag-icons/flags/1x1/by.svg?react'
import ch from 'flag-icons/flags/1x1/ch.svg?react'
import cn from 'flag-icons/flags/1x1/cn.svg?react'
import de from 'flag-icons/flags/1x1/de.svg?react'
import fi from 'flag-icons/flags/1x1/fi.svg?react'
import fr from 'flag-icons/flags/1x1/fr.svg?react'
import gb from 'flag-icons/flags/1x1/gb.svg?react'
import ge from 'flag-icons/flags/1x1/ge.svg?react'
import kg from 'flag-icons/flags/1x1/kg.svg?react'
import kz from 'flag-icons/flags/1x1/kz.svg?react'
import ru from 'flag-icons/flags/1x1/ru.svg?react'
import ua from 'flag-icons/flags/1x1/ua.svg?react'
import us from 'flag-icons/flags/1x1/us.svg?react'

type FlagSprite = FC<SVGProps<SVGSVGElement>>

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
