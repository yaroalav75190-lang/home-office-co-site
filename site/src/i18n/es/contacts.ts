// /contacts, verbatim from docs/content/copy-contacts.md (v1.0, 2 Nov 2026).
// Facts stay in src/views/contacts.tsx and src/lib/site.ts: the #zapis anchor, phone numbers,
// e-mail, links, broker hours. Channel names: `common.channels`; destination names and clock
// labels: `common.destinations`; the requisites line: `common.footer.requisites`. Title and
// description of the page: `meta.contacts`.

import type { ContactsDict } from '../ru/contacts'

export const contacts = {
  hero: {
    /** h1, D1. */
    title: 'Contacto',
    /** Paragraph in D3 under the h1. */
    line: 'Nos reunimos en persona en Phuket: en la propiedad o en un centro de negocios cercano',
  },

  channels: {
    title: 'Cómo contactarnos',
    /**
     * Who answers Telegram, WhatsApp and the phone (the founder, DEMO_DECISIONS), under the channel
     * address: «Иван, основатель». {name} and {role} come from `common.founder`.
     */
    owner: '{name}, {role}',
    fallback: 'Si Telegram o WhatsApp no se abren, llámenos o escríbanos un correo',
    /**
     * Broker hours next to the local clocks. {open}/{close}: hours on Phuket; {mskOpen}/{mskClose}:
     * the same hours in Moscow. Russia-specific: the Moscow part and the second sentence (Krasnoyarsk
     * and Novosibirsk have the same time as Phuket, UTC+7) are for visitors from Russia; translations
     * may drop them and keep only {open} and {close}. Times come formatted by locale («9:00», «9:00 am»).
     */
    hours: 'Los asesores atienden de {open} a {close}, hora de Phuket',
    /**
     * Under the hours. «15 минут» is the promised reply time; {openReply}: opening + 15 minutes on the
     * Phuket clock («9:15», «9:15 am»).
     */
    promise: 'En ese horario respondemos en 15 minutos. Si nos escribe de noche, veremos su solicitud por la mañana y le responderemos antes de las {openReply}, hora de Phuket',
  },

  /** Booking block on the ink field, next to the viewing form (anchor #zapis). */
  booking: {
    title: 'Reservar una visita',
    text: 'Elija una hora de Phuket; al lado le mostramos la suya',
    /** DEMO_DECISIONS «Стоимость консультации» (the client confirms before launch). */
    price: 'La consulta es gratuita',
    /** Small line under the form. */
    after: 'Si no puede viajar, elija una visita virtual. El procedimiento de firma a distancia se lo explicamos de antemano',
  },

  meet: {
    /** Caption under the Nai Harn photo, after the locator. */
    photoCaption: 'Nai Harn, sur de Phuket',
    title: 'Dónde nos reunimos',
    /** The year the agency opened (2026, DEMO_DECISIONS «Год открытия») and the figures are facts: keep them. */
    paragraphs: [
      'En persona en Phuket: en la propiedad que haya elegido o en un centro de negocios cercano. Le enviamos la dirección de la reunión en cuanto reserve.',
      'Nuestros especialistas trabajan desde hace más de 5 años en mercados internacionales y tienen más de 100 clientes. En 2026 fundaron la agencia Home Office & Co.',
    ],
    /** Placeholder: optional Small line under the paragraphs; empty hides it. */
    yearNote: '',
    /** Small heading above `common.footer.requisites`. */
    requisitesTitle: 'Datos de la empresa',
  },
} satisfies ContactsDict
