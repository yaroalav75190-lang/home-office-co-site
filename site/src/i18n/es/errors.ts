// 404 page (copy-global §11) and the error screens (error.tsx, global-error.tsx).

import type { ErrorsDict } from '../ru/errors'

export const errors = {
  notFound: {
    /**
     * Two D1 lines, the second indented. Each line is one `nowrap`-free block, but keep it short.
     * Spanish: «Bahía fuera» (11) / «del mapa» (8), the same map image as the Russian.
     */
    titleLines: ['Bahía fuera', 'del mapa'],
    lead: 'En esta dirección no hay ninguna página. El enlace ha caducado o la dirección tiene una errata',
    cta: 'Buscar propiedad',
    navLabel: 'Secciones del sitio',
    links: {
      phuket: 'Inmuebles en Phuket',
      deal: 'Gestión de la compra',
      podbor: 'Buscar propiedad',
      contacts: 'Contacto',
      home: 'Ir al inicio',
    },
  },
  /** error.tsx and global-error.tsx: the page crashed. */
  error: {
    title: 'La página no se ha cargado',
    text: 'Vuelva a cargarla. Si no funciona, escriba o llame a un asesor: le responderemos y le enviaremos lo que buscaba',
    retry: 'Volver a cargar',
    /** Link to Telegram on the last-resort screen (global-error.tsx has no access to `common`); same as `common.channels.telegram.action`. */
    telegram: 'Escribir por Telegram',
  },
} satisfies ErrorsDict
