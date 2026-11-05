// Russian dictionary: the source of truth. Its type is the contract for en/ and es/: every file
// there `satisfies` the type of the Russian file with the same name, so a missing or an extra key
// is a type error.

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

export const ru = {
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

export type Dictionary = typeof ru
