// Photo alt texts and captions, by photo key (files, sizes and credits stay in src/lib/photos.ts).
// alt: what is actually in the frame. caption: under the photo, «Место, побережье»; a caption names
// a place only when the source confirms it; format photos say «Пример формата: …».

import type { PhotosDict, PhotoCreditsDict } from '../ru/photos'

export const photos = {
  hero: {
    alt: 'Larga playa de Phuket desde el aire: un arco de arena blanca entre casuarinas y agua turquesa poco profunda, barcos fondeados y un banco de arena a lo lejos',
    caption: 'Costa oeste de Phuket',
  },
  phuket: {
    alt: 'Bahía de Ya Nui desde un mirador: un cabo boscoso, un islote enfrente, una pequeña playa y un yate fondeado',
    caption: 'Ya Nui, costa suroeste de Phuket',
  },
  bangtao: {
    alt: 'Playa de Bang Tao de día: tumbonas y sombrillas bajo las palmeras, arena blanca, barcos en el agua y un cabo boscoso al norte de la bahía',
    caption: 'Bang Tao, costa oeste de Phuket',
  },
  sunset: {
    alt: 'Atardecer en la playa de Bang Tao: rocas en primer plano, arena mojada que refleja el cielo y la silueta de un cabo boscoso',
    caption: 'Atardecer en Bang Tao, costa oeste de Phuket',
  },
  kata: {
    alt: 'Playa de Kata al atardecer, vista desde el agua: un barco de cola larga, la isla de Koh Pu y el sol que se pone tras el cabo',
    caption: 'Kata, costa oeste de Phuket',
  },
  naiharn: {
    alt: 'Bahía de Nai Harn desde la ladera: la playa con el lago detrás, yates fondeados, una isla a la entrada de la bahía y matorral seco en primer plano',
    caption: 'Nai Harn, costa suroeste de Phuket',
  },
  pattaya: {
    alt: 'Pattaya desde el aire: una larga playa a lo largo de la bahía, edificios altos en el paseo marítimo y la ciudad detrás',
    caption: 'Pattaya, costa del golfo de Tailandia',
  },
  bali: {
    alt: 'Acantilado junto al templo de Uluwatu, en Bali: rocas verdes, un sendero por el borde y, abajo, el oleaje y una roca entre la espuma',
    caption: 'Uluwatu, península de Bukit, Bali',
  },
  villa: {
    alt: 'Piscina panorámica de una villa en una ladera: el borde del agua se funde con el mar, islas en el horizonte y un pabellón blanco a la izquierda',
    caption: 'Ejemplo de formato: villa con piscina',
  },
  dubai: {
    alt: 'Rascacielos de Dubai Marina al otro lado de la bahía, vistos desde una playa de Palm Jumeirah, con lanchas en el agua',
    caption: 'Dubai Marina, vista desde Palm Jumeirah',
  },
  cambodia: {
    alt: 'Dos palmeras inclinadas en una playa de Koh Rong al atardecer, islas en el horizonte y arena mojada',
    caption: 'Koh Rong, costa de Sihanoukville',
  },
  kamala: {
    alt: 'Playa escondida en Kamala bajo colinas boscosas: una franja de arena, agua turquesa y, al otro lado de la bahía, la colina de Patong bajo una nube de lluvia',
    caption: 'Kamala, costa oeste de Phuket',
  },
  banana: {
    alt: 'Bahía de la playa Banana, en el noroeste de Phuket: agua turquesa, un cabo boscoso con una sola villa y rocas de granito en primer plano',
    caption: 'Playa Banana, Choeng Thale, 3 km al norte de Bang Tao',
  },
  naiharnRocks: {
    alt: 'Playa de Nai Harn desde arriba: una diagonal de arena entre el agua turquesa y los árboles, con hileras de sombrillas azules',
    caption: 'Nai Harn, costa suroeste de Phuket',
  },
  condo: {
    alt: 'Condominio de poca altura con piscina común: terrazas y balcones, árboles y césped junto al agua',
    caption: 'Ejemplo de formato: condominio con piscina común',
  },
  house: {
    alt: 'Casa moderna de una planta con revestimiento de madera, piscina y césped bajo los árboles',
    caption: 'Ejemplo de formato: casa para vivir',
  },
  bigBuddha: {
    alt: 'Gran Buda en la colina Nakkerd: una estatua blanca sobre laderas boscosas y, abajo, la costa y el mar',
    caption: 'Gran Buda en la colina Nakkerd, sobre Chalong y Kata',
  },
  baliVilla: {
    alt: 'Villa en Ubud: un pabellón acristalado bajo un tejado inclinado, tumbonas y sombrillas en la terraza junto a la piscina, vegetación tropical',
    caption: 'Ejemplo de propiedad: villa con piscina, Ubud, Bali',
  },
  dubaiHome: {
    alt: 'Torres residenciales de Dubai Marina desde una terraza con piscina: rascacielos sobre un canal con yates',
    caption: 'Ejemplo de propiedad: apartamento en Dubai Marina',
  },
  pattayaCondo: {
    alt: 'Dos torres de condominios junto al mar en Pattaya, con un barrio arbolado abajo e islas en el horizonte',
    caption: 'Ejemplo de propiedad: condominios junto al mar, Pattaya',
  },
  cambodiaCondo: {
    alt: 'Complejo residencial de gran altura en la costa de Sihanoukville, desde el aire: una torre junto a la playa, mar turquesa y una península artificial',
    caption: 'Ejemplo de propiedad: complejo residencial junto al mar, Sihanoukville',
  },
} satisfies PhotosDict

/** Lines of the /credits rows that come from the photo registry. */
export const photoCredits = {
  changes: 'Recorte y corrección de color',
  /** Extra request of the author of the Bang Tao sunset photo. */
  sunsetNote: 'A petición del autor, su nombre figura en el pie de la foto',
} satisfies PhotoCreditsDict
