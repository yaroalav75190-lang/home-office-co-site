// Legal and service pages: /privacy, /consent (promo versions under 152-ФЗ, DEMO_DECISIONS
// «Юридические тексты»; a lawyer checks them before launch) and /credits (plain, factual wording).
// Facts stay in the views: e-mail and its link, hrefs, edition dates, the OpenStreetMap data date,
// photo authors, licenses and source links (src/lib/photos.ts). Titles and descriptions: `meta`.
//
// LEGAL TEXT: `privacy` and `consent` are legal documents. Translate them faithfully, sentence by
// sentence: no shortening, no rewording, keep the section numbers and the list punctuation (items
// end with «;», the last one with «.»). They are written for Russian law (152-ФЗ) and a Russian
// audience; the Russian text is the binding one (see `prevailNote`).
// Placeholders: {name} is the agency name (Home Office & Co), {email} the e-mail link, {link} a link
// whose text is the `link` string next to the template, {date} a date in the form of the locale.
// Spanish: «оператор персональных данных» (the 152-ФЗ term) is kept as «operador de datos
// personales», not replaced by the GDPR «responsable del tratamiento».

import type { LegalDict } from '../ru/legal'

export const legal = {
  /**
   * One Small line right under the h1 of /privacy and /consent saying that the Russian text
   * prevails. Empty in Russian (nothing is rendered); translations state it in one sentence.
   */
  prevailNote: 'Esta es una traducción. Si difiere del texto en ruso, prevalece el texto en ruso.',
  /** Last line of /privacy and /consent; {date} is the edition date («03.11.2026»). */
  edition: 'Versión del {date}',

  /** LEGAL TEXT (152-ФЗ): translate faithfully. */
  privacy: {
    title: 'Política de privacidad',
    lead: 'Cómo {name} trata los datos personales de quienes visitan el sitio web y envían una solicitud.',
    operator: {
      title: '1. Quién trata los datos',
      text: 'Operador de datos personales: la agencia inmobiliaria {name}. Enviamos los datos de la empresa para el contrato si se solicitan. Las consultas sobre los datos se atienden en el correo {email}.',
    },
    data: {
      title: '2. Qué datos recopilamos',
      items: [
        'nombre;',
        'el contacto que haya indicado: teléfono, usuario o número de Telegram, número de WhatsApp o correo electrónico;',
        'las respuestas de los formularios: destino y zona, objetivo de la compra, presupuesto, plazo, formato, fecha y hora de la reunión, comentario;',
        'datos técnicos de la solicitud: la página desde la que se envió, la fuente de la visita, las etiquetas de la campaña publicitaria y los identificadores de cookies de los sistemas de analítica.',
      ],
      note: 'En el sitio web no recopilamos datos del pasaporte ni de tarjetas bancarias.',
    },
    purposes: {
      title: '3. Para qué',
      items: [
        'para responder a su solicitud por el canal que haya elegido;',
        'para seleccionar inmuebles y enviarle una selección;',
        'para reservarle una consulta o una visita;',
        'para enviarle la guía del inversor, si la ha solicitado;',
        'para contar las visitas y entender qué páginas resultan útiles. Estos datos están anonimizados.',
      ],
      note: 'No enviamos comunicaciones que no haya solicitado. No vendemos los datos ni los cedemos a otras empresas con fines publicitarios.',
    },
    storage: {
      title: '4. Dónde los guardamos',
      text: 'Las solicitudes se guardan en el sistema CRM de la agencia. El aviso de cada nueva solicitud llega a los asesores de la agencia por Telegram. Solo tienen acceso a los datos los empleados que gestionan su solicitud.',
    },
    retention: {
      title: '5. Cuánto tiempo los guardamos',
      text: 'Mientras los datos sean necesarios para responder a la solicitud, seleccionar propiedades y gestionar la compra, pero no más de 3 años desde el último contacto. Después de ese plazo, o tras la revocación del consentimiento, eliminamos los datos.',
    },
    rights: {
      title: '6. Sus derechos y la revocación del consentimiento',
      text: 'Puede saber qué datos suyos se conservan, pedir que se corrijan o se eliminen y revocar su consentimiento para el tratamiento. Escriba a {email} desde el contacto que indicó en la solicitud. Responderemos en un plazo de 10 días hábiles y, tras la revocación del consentimiento, eliminaremos los datos en un plazo de 30 días.',
    },
    /** «Яндекс Метрика» is the analytics service the site uses (a proper name). */
    cookies: {
      title: '7. Cookies y analítica',
      text: 'El sitio web utiliza cookies y Yandex Metrica para contar las visitas y entender qué páginas resultan útiles. Puede desactivar las cookies en la configuración del navegador; el sitio seguirá funcionando.',
    },
    consent: {
      title: '8. Consentimiento',
      /** {link}: link to /consent with the text `link`. */
      text: 'El consentimiento para el tratamiento de datos personales se formaliza en un documento aparte: {link}. La versión vigente de la política está siempre en esta página.',
      link: 'consentimiento para el tratamiento de datos personales',
    },
  },

  /** LEGAL TEXT (152-ФЗ, a separate document since 1 Sept 2025): translate faithfully. */
  consent: {
    title: 'Consentimiento para el tratamiento de datos personales',
    lead: 'Al marcar la casilla de consentimiento en un formulario del sitio web, usted autoriza, de forma libre, por voluntad propia y en su propio interés, a la agencia {name} a tratar sus datos personales en las condiciones que se indican a continuación.',
    operator: {
      title: '1. Operador',
      text: 'Agencia inmobiliaria {name}. Enviamos los datos de la empresa para el contrato si se solicitan; correo para consultas sobre los datos: {email}.',
    },
    data: {
      title: '2. Qué datos',
      items: [
        'nombre;',
        'teléfono, usuario o número de mensajería, dirección de correo electrónico: el contacto que haya indicado;',
        'respuestas del cuestionario y de los formularios de reserva: destino y zona, objetivo, presupuesto, plazo, formato, fecha y hora de la reunión, comentario;',
        'datos técnicos de la solicitud: la página desde la que se envió, la fuente de la visita, las etiquetas de la campaña publicitaria, los identificadores de cookies de los sistemas de analítica.',
      ],
    },
    purposes: {
      title: '3. Fines',
      items: [
        'ponernos en contacto con usted sobre su solicitud por el canal elegido;',
        'seleccionar inmuebles y enviarle una selección;',
        'reservarle una consulta o una visita;',
        'enviarle la guía del inversor, si la ha solicitado.',
      ],
    },
    processing: {
      title: '4. Qué hacemos con los datos',
      text: 'Los recopilamos, registramos, sistematizamos, almacenamos en el sistema CRM de la agencia, actualizamos, utilizamos para responder y seleccionar propiedades, los transmitimos a los asesores de la agencia que gestionan la solicitud, los suprimimos y los destruimos. El tratamiento se realiza con y sin medios automatizados.',
    },
    term: {
      title: '5. Plazo',
      /** «раздела 3» refers to section 3 above: keep the number. */
      text: 'El consentimiento es válido mientras los datos sean necesarios para los fines del apartado 3, pero no más de 3 años desde el último contacto, o hasta su revocación.',
    },
    withdrawal: {
      title: '6. Cómo revocar el consentimiento',
      text: 'Escriba a {email} desde el contacto que indicó en la solicitud. Eliminaremos los datos en un plazo de 30 días desde la recepción de la revocación.',
    },
    more: {
      title: '7. Más información',
      /** {link}: link to /privacy with the text `link`. */
      text: 'Cómo guardamos y usamos los datos se explica en la {link}.',
      link: 'política de privacidad',
    },
  },

  /** /credits: authors and licenses of photos, map data, fonts and code. Plain, factual wording. */
  credits: {
    title: 'Autores de fotos y datos de mapas',
    lead: 'Las fotografías proceden de Unsplash; dos imágenes de Bang Tao, de Wikimedia Commons. Las recortamos y ajustamos el color; los autores y las licencias figuran a continuación.',
    /** Rows of the photo list; each row is captioned with the caption of its photo (`photos`). */
    photos: {
      title: 'Fotografías',
      /** {author}: name of the author as the source gives it (kept in the original spelling). */
      author: 'Autor: {author}',
      /** {license}: the license name as a link («Unsplash License», «CC BY 2.0»), or `publicDomain`. */
      license: 'Licencia: {license}',
      publicDomain: 'dominio público',
      /** Link texts to the source page of the photo. */
      sourceUnsplash: 'Página de la foto en Unsplash',
      sourceCommons: 'Página del archivo en Commons',
      /** {changes}: `photoCredits.changes`, lower-cased by the page. */
      changes: 'Cambios: {changes}',
      /** Rows under a share-alike license (CC BY-SA). */
      shareAlike: 'Nuestras versiones de la imagen se publican con la misma licencia',
    },
    maps: {
      title: 'Mapas',
      /**
       * {attribution}: `places.osmAttribution` («© участники OpenStreetMap», required by the ODbL);
       * {license}: link with the text `license`; {date}: date of the map data («02.11.2026»).
       */
      text: 'Línea de costa en los mapas y en los pies de foto: {attribution}, licencia {license}, datos a fecha de {date}, simplificada. Nuestros contornos, elaborados a partir de estos datos, se distribuyen con la misma licencia.',
      /** Official license name: keep in English as is. */
      license: 'Open Database License 1.0',
    },
    software: {
      title: 'Fuentes y código',
      /**
       * `name`: what was used (product names stay as they are); `license`: the official license name
       * and holder, keep as is (only the quote marks in the GSAP one follow your language).
       */
      items: [
        { name: 'Fuentes Noto Serif Display y Onest', license: 'SIL Open Font License 1.1' },
        { name: 'Next.js y React', license: 'MIT' },
        { name: 'GSAP', license: 'Standard «No Charge» License, GreenSock' },
        { name: 'Lenis', license: 'MIT, darkroom.engineering' },
        { name: 'Satūs: desplazamiento suave y JSON-LD', license: 'MIT, darkroom.engineering' },
        { name: 'Enklawa Villas y Isle Thorne Collective: técnicas de maquetación y transiciones', license: 'MIT' },
        { name: 'ARVEN: técnicas de tipografía y del formulario de reserva, reescritas en React', license: 'Apache License 2.0' },
      ],
    },
  },
} satisfies LegalDict
