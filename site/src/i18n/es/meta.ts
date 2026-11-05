// Page titles and descriptions (seo-brief §4): <title>, meta description, Open Graph and JSON-LD names.
// Titles marked «absolute» skip the « | Home Office & Co» template; keep them under 60 characters.

import type { MetaDict } from '../ru/meta'

export const meta = {
  site: {
    /** Default description of the root layout; uses only facts from the brief. Pages set their own. */
    description:
      'Agencia inmobiliaria Home Office & Co: apartamentos y villas en Phuket, Pattaya, Bali, Dubái y Camboya. Búsqueda, revisión de documentos y gestión de la compra.',
  },
  /** Absolute title. */
  home: {
    title: 'Agencia inmobiliaria en Phuket | Home Office & Co',
    description:
      'Agencia inmobiliaria en Phuket: apartamentos y villas en Tailandia, Bali, Dubái y Camboya. Búsqueda, revisión de documentos y compra. Respuesta en 15 minutos.',
  },
  /** Absolute title. */
  phuket: {
    title: 'Propiedades en Phuket: comprar apartamento o villa',
    description:
      'Apartamentos y villas en Phuket, de obra nueva y de reventa: seis zonas para vivir y alquilar, propiedad para extranjeros y compra con un asesor.',
  },
  /** District pages, by district id. Absolute titles. */
  districts: {
    'bang-tao': {
      title: 'Propiedades en Bang Tao: apartamentos y villas en Phuket',
      description:
        'Propiedades en Bang Tao, Phuket: apartamentos y villas junto a la Laguna, para quién es la zona, alquiler por temporadas, pros y contras sin adornos.',
    },
  },
  /** Absolute title. */
  deal: {
    title: 'Gestión de la compra de inmuebles en Tailandia',
    description:
      'Compra de inmuebles en Tailandia de la elección a las llaves: revisión de la promotora y los documentos, contrato, pago, registro, alquiler o reventa.',
  },
  /** Absolute title. */
  podbor: {
    title: 'Búsqueda de propiedades: Phuket, Pattaya, Bali, Dubái',
    description:
      'Cuatro preguntas: país, objetivo, presupuesto y plazo. El asesor responde en 15 minutos por el canal elegido y envía de 3 a 5 proyectos con precio y contras.',
  },
  /** Absolute title. */
  contacts: {
    title: 'Contacto de Home Office & Co: consulta y visitas',
    description:
      'Teléfono, Telegram y correo de Home Office & Co. Reserve una consulta en línea o una visita a una propiedad en Phuket: elija fecha, hora de Phuket y formato.',
  },
  /** Title with the « | Home Office & Co» template. */
  privacy: {
    title: 'Política de privacidad',
    description:
      'Qué datos personales recopila el sitio web de Home Office & Co, para qué, dónde y durante cuánto tiempo los guarda y cómo revocar el consentimiento.',
  },
  /**
   * Title with the « | Home Office & Co» template. Spanish: «al tratamiento de datos» keeps the
   * full title within 60 characters; the page h1 is the full legal name (`legal.consent.title`).
   */
  consent: {
    title: 'Consentimiento al tratamiento de datos',
    description: 'Consentimiento para el tratamiento de datos personales en las solicitudes enviadas desde el sitio web de Home Office & Co.',
  },
  /** Title with the « | Home Office & Co» template. */
  credits: {
    title: 'Autores de fotos y datos de mapas',
    description: 'Autores y licencias de las fotografías y de los datos cartográficos del sitio web de Home Office & Co.',
  },
  /** Absolute title of the 404 page. */
  notFound: {
    title: 'Página no encontrada | Home Office & Co',
  },
} satisfies MetaDict
