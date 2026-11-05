// /services/deal, verbatim from docs/content/copy-deal.md (v1.0, 2 Nov 2026). Stage terms, the
// consultation price and the fee answer follow docs/DEMO_DECISIONS.md (typical terms, «обычно»).
// Facts stay in src/views/deal.tsx: stage anchors (#izuchenie-rynka …), the #konsultaciya anchor,
// hrefs and photo keys. Title and description of the page: `meta.deal`.

import type { DealDict } from '../ru/deal'

export const deal = {
  /** JSON-LD `Service` (not shown on the page): service name and the countries served. */
  schema: {
    name: 'Gestión de la compra de inmuebles',
    areaServed: ['Tailandia', 'Indonesia', 'Emiratos Árabes Unidos', 'Camboya'],
  },

  hero: {
    /**
     * h1, two D1 lines; the second starts one third of the grid in. From 1024 px each line is a
     * single `nowrap` line: the translation must not be wider than the Russian, 13 characters
     * («Сопровождение») and 6 characters («сделки»; it has a third less room because of the indent).
     * Spanish: «Gestión de la» (13) / «compra» (6), the same words as `common.nav.deal`.
     */
    titleLines: ['Gestión de la', 'compra'],
    lead: 'Gestionamos la compra de inmuebles en Tailandia, desde la elección de la zona hasta las llaves y el alquiler. Un mismo asesor en todo el proceso',
    /** Button label (jumps to the consultation form); Russian 26 characters, keep it on one line. */
    cta: 'Reservar una consulta',
  },

  stages: {
    title: 'Seis etapas de la compra',
    lead: 'En cada etapa queda claro quién hace qué y con qué documentos se queda usted',
    /** Screen-reader name of the sticky list of stages. */
    navLabel: 'Etapas de la compra',
    /** Labels of the two rows under each stage. */
    documentsLabel: 'Documentos',
    termLabel: 'Plazo',
    /**
     * The six stages, in this order: the page gives them their anchors by position. `nav` is the
     * label in the sticky list (narrow column from 1024 px): keep it short, Russian at most 20
     * characters. «Оплата из России» is Russia-specific (the audience pays from Russia).
     */
    items: [
      {
        nav: 'Estudio del mercado',
        title: 'Estudio del mercado',
        text: 'Concretamos el objetivo (vivir, alquilar o preservar capital), el presupuesto y los plazos. En 24 horas le enviamos de 3 a 5 proyectos por un enlace privado, cada uno con su precio actual, tipo de propiedad, fase de obra, pros y contras. Mostramos las propiedades en persona o por videollamada.',
        documents: 'Selección por enlace privado',
        term: 'normalmente 1–3 días',
      },
      {
        nav: 'Verificación',
        title: 'Verificación de la promotora y los documentos',
        text: 'Antes de reservar, vemos cómo y en qué plazos entregó la promotora sus edificios anteriores. Revisamos los documentos del terreno, la licencia de obra y la cuota extranjera disponible. Si encontramos un riesgo, se lo decimos con claridad y le proponemos otro proyecto.',
        /** copy-deal: [согласовать список с юристом]. «чанот» is the Thai title deed (chanote). */
        documents: 'Título del terreno (chanote), licencia de la promotora, licencia de obra, datos de la cuota disponible',
        term: 'normalmente 3–7 días',
      },
      {
        nav: 'Reserva y contrato',
        title: 'Reserva y contrato',
        text: 'Reservamos el apartamento y leemos el contrato con un abogado: calendario de pagos, plazos de entrega y obligaciones de la promotora si se retrasa.',
        documents: 'Contrato de reserva, contrato de compraventa, calendario de pagos',
        term: 'normalmente 1–2 semanas',
      },
      {
        nav: 'Pago y registro',
        /** Russia-specific: «из России». Spanish: paying from abroad (guide §6a). */
        title: 'Pago desde el extranjero y registro',
        text: 'El dinero llega a Tailandia desde el extranjero en divisas, el banco emite una confirmación de la transferencia y, con ella, la propiedad se inscribe en el Departamento de Tierras. Las formas de pago desde el extranjero se explican en el bloque siguiente.',
        documents: 'Confirmación bancaria de cada transferencia, documentos del registro de la propiedad',
        term: 'según el calendario de la promotora; el registro, normalmente 1–2 semanas tras el pago completo',
      },
      {
        nav: 'Entrega y llaves',
        title: 'Entrega y llaves',
        text: 'Revisamos el apartamento según el contrato antes de firmar el acta de recepción. Anotamos los defectos y se los trasladamos a la promotora. Tras el acta y el registro, usted recibe las llaves.',
        documents: 'Acta de recepción, título de propiedad',
        term: 'normalmente 1–2 días',
      },
      {
        nav: 'Alquiler y reventa',
        /** «После ключей» in the text is the title of the block `afterKeys` below: keep them the same. */
        title: 'Alquiler y reventa',
        text: 'Alquilamos el apartamento a través de empresas de gestión asociadas y lo vendemos cuando usted decida salir de la inversión. Más detalles en el bloque «Tras las llaves».',
        documents: 'Contrato con la empresa de gestión',
        term: 'mientras sea propietario',
      },
    ],
    /** Link under the stages to the investor guide on the home page. */
    guideLink: 'La compra paso a paso, en detalle: capítulo 8 de la guía del inversor',
  },

  checks: {
    title: 'Qué revisamos antes del pago',
    items: [
      { name: 'Título del terreno', text: 'Chanote u otro documento: a quién pertenece la parcela y si tiene cargas' },
      { name: 'Licencia e historial de la promotora', text: 'Cómo y cuándo entregó sus edificios anteriores' },
      { name: 'Licencia de obra', text: 'Si se ha concedido para este proyecto y qué permite' },
      { name: 'Contrato y calendario de pagos', text: 'Cuánto y cuándo paga usted, qué ocurre si hay retrasos' },
      { name: 'Cuota extranjera disponible', text: 'Cuánta superficie del edificio puede inscribirse aún a nombre de extranjeros' },
    ],
    /**
     * Placeholder: «Список согласован с {имя юриста}» once a partner lawyer has checked it; empty
     * hides the line (copy-round2 §5). Keep it empty in translations while the Russian is empty.
     */
    note: '',
  },

  /** Russia-specific block: the audience pays from Russia («Оплата из России»). Translate faithfully. */
  payment: {
    /** h2 D3 in a narrow column (3 of 12 from 1024 px). */
    title: 'Pago desde el extranjero',
    paragraphs: [
      'El pago se hace solo por vías legales que funcionan hoy. No ofrecemos fórmulas para eludir restricciones.',
      'Si el apartamento se inscribe en propiedad, el dinero debe llegar a Tailandia desde el extranjero en divisas. El banco emite una confirmación de cada transferencia y, sin ella, la propiedad no se registra. Un edificio en construcción suele pagarse a plazos según el calendario de la promotora, y cada pago sigue el mismo camino.',
      'Qué formas de pago son posibles hoy lo vemos en la consulta. Las normas cambian, por eso el asesor solo indica las vías que la agencia utiliza para tramitar pagos en el momento de la conversación.',
    ],
    /** Placeholder: empty hides the line; the check by the lawyer is a note for the team, not for the page (copy-round2 §5). */
    note: '',
  },

  afterKeys: {
    /** Caption under the Nai Harn panorama, after the locator. */
    photoCaption: 'Nai Harn, sur de Phuket',
    title: 'Tras las llaves',
    /**
     * `note`: placeholder for a Small line naming rental partners, only once the client allows it
     * (copy-round2 §5); empty hides it.
     */
    items: [
      {
        title: 'Alquiler con empresas asociadas',
        text: 'Le ayudamos a elegir una empresa de gestión entre nuestros socios y a comparar condiciones. No prometemos ingresos garantizados: calculamos la ocupación real por temporadas, los gastos de gestión y los impuestos.',
        note: '',
      },
      {
        title: 'Reventa',
        text: 'Cuando decida vender, valoramos el apartamento según el mercado actual y buscamos comprador. El asesor que llevó la compra conoce la propiedad y sus documentos, así que no hay que empezar de cero.',
        note: '',
      },
    ],
  },

  /** Cost is the first question. */
  faq: {
    title: 'Coste y preguntas frecuentes',
    items: [
      {
        q: '¿Cuánto cuesta la gestión de la compra?',
        a: 'El coste depende de la propiedad y del encargo; se lo indicamos en la consulta, antes de empezar. Además del precio de la propiedad, el comprador paga las tasas de registro y las comisiones bancarias de la transferencia. El asesor calcula las cifras exactas para su propiedad antes de reservar.',
      },
      {
        q: '¿Qué revisan exactamente?',
        a: 'Revisamos los documentos del terreno, la licencia de obra, la cuota extranjera disponible, el contrato con el calendario de pagos y el historial de la promotora: cómo y cuándo entregó sus edificios anteriores. Lo hacemos antes de reservar, para que el depósito no vaya a un proyecto con problemas. Conocerá cada riesgo que encontremos antes de firmar la reserva.',
      },
      {
        q: '¿Y si la promotora se retrasa?',
        a: 'Ese riesgo lo reducimos antes de comprar: vemos cómo entregó la promotora sus proyectos anteriores y revisamos las licencias y el calendario de pagos. En un calendario por fases, cada pago está vinculado a una fase de la obra. No le propondremos un proyecto de riesgo. Qué ocurre si se incumple el plazo se fija de antemano en el contrato.',
      },
      {
        q: '¿Se puede comprar sin viajar a Tailandia?',
        a: 'Sí. Le mostramos la propiedad por videollamada: el asesor recorre el apartamento y el complejo y responde a sus preguntas durante la llamada. El procedimiento de firma a distancia se lo explicamos de antemano, antes de reservar.',
      },
      {
        q: 'Ya he elegido una propiedad. ¿Me ayudan a revisarla?',
        a: 'Sí. Cuéntenos en la consulta qué ha elegido y en qué punto está. Revisaremos la promotora y los documentos antes de reservar y le diremos qué nos genera dudas. Las condiciones de esta revisión las acordamos en la consulta.',
      },
      {
        q: '¿Solo venden propiedades de sus socios?',
        a: 'No. Trabajamos con todo el mercado tailandés, sin vínculos con una sola promotora. En la selección, cada proyecto tiene un apartado de inconvenientes. Nosotros mismos compramos inmuebles aquí e invertimos en proyectos conjuntos con clientes, así que miramos cada propiedad como compradores.',
      },
    ],
  },

  /** Consultation block on the ink field, next to the booking form. */
  consultation: {
    title: 'Analizamos su compra',
    text: '30 minutos con un asesor por videollamada, por teléfono o en una reunión en Phuket. Puede venir con una propiedad que ya haya elegido.',
    /** DEMO_DECISIONS «Стоимость консультации» (the client confirms before launch). */
    price: 'La consulta es gratuita',
  },
} satisfies DealDict
