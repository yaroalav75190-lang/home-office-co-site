// Spanish dictionary. Each file satisfies the type of the Russian file with the same name.

import type { Dictionary } from '../ru'
import { common } from './common'
import { contacts } from './contacts'
import { deal } from './deal'
import { districts } from './districts'
import { errors } from './errors'
import { forms } from './forms'
import { home } from './home'
import { legal } from './legal'
import { meta } from './meta'
import { photoCredits, photos } from './photos'
import { phuket } from './phuket'
import { places } from './places'
import { podbor } from './podbor'

export const es: Dictionary = {
  common,
  home,
  phuket,
  districts,
  deal,
  podbor,
  contacts,
  forms,
  legal,
  photos,
  photoCredits,
  places,
  errors,
  meta,
}
