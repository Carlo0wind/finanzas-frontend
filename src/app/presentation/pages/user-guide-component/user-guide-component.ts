import { Component, signal } from '@angular/core';
import {Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

interface GuideSection {
  id: string;
  title: string;
  icon: string;
  iconBg: string;
  subsections: GuideSubsection[];
}

interface GuideSubsection {
  id: string;
  title: string;
  content: string;
  formula?: string;
  example?: string;
  image?: string;
}

@Component({
  selector: 'app-user-guide-component',
  imports: [
    MatIcon
  ],
  templateUrl: './user-guide-component.html',
  styleUrl: './user-guide-component.css',
})
export class UserGuideComponent {
  activeSection = signal<string>('introduccion');

  sections: GuideSection[] = [
    {
      id: 'introduccion',
      title: 'Introducción',
      icon: 'info',
      iconBg: '#667eea',
      subsections: [
        {
          id: 'que-es-hominy',
          title: '¿Qué es Hominy?',
          content: 'Hominy es una aplicación web diseñada para empresas inmobiliarias que permite simular créditos del Nuevo Fondo MiVivienda de manera precisa y transparente. El sistema considera las condiciones reales de las 18 entidades financieras autorizadas en Perú.'
        },
        {
          id: 'objetivo',
          title: 'Objetivo del Sistema',
          content: 'Facilitar la toma de decisiones informadas sobre créditos hipotecarios mediante simulaciones precisas que incluyen todos los costos asociados, períodos de gracia, bonos estatales e indicadores financieros como VAN, TIR y TCEA.'
        },
        {
          id: 'problema',
          title: 'Problema que Resuelve',
          content: 'El acceso a vivienda propia en Perú enfrenta múltiples barreras: complejidad del mercado hipotecario, diversidad de tasas de interés, falta de transparencia en costos totales y desconocimiento de beneficios como el Bono del Buen Pagador. Hominy centraliza esta información y la presenta de forma clara y comparable.'
        }
      ]
    },
    {
      id: 'credito-mivivienda',
      title: 'Crédito MiVivienda',
      icon: 'home',
      iconBg: '#10B981',
      subsections: [
        {
          id: 'que-es-mivivienda',
          title: '¿Qué es el Crédito MiVivienda?',
          content: 'El Nuevo Crédito MiVivienda es un programa del Estado peruano que facilita el acceso a vivienda propia mediante créditos hipotecarios con condiciones competitivas. Es otorgado por 18 entidades financieras autorizadas.'
        },
        {
          id: 'bono-buen-pagador',
          title: 'Bono del Buen Pagador (BBP)',
          content: 'Es un beneficio económico que otorga el Estado para reducir el monto del crédito. Existen 4 tipos de bonos según el tipo de vivienda y características del cliente.',
          example: 'Tipos de Bono:\n• Vivienda Tradicional\n• Vivienda Sostenible\n• Integrador Tradicional\n• Integrador Sostenible'
        },
        {
          id: 'requisitos-generales',
          title: 'Requisitos Generales',
          content: 'Los requisitos varían según la entidad financiera, pero generalmente incluyen: precio de vivienda máximo, cuota inicial mínima, ingresos mínimos, antigüedad laboral, historial crediticio y no tener otro financiamiento vigente.'
        }
      ]
    },
    {
      id: 'conceptos-financieros',
      title: 'Conceptos Financieros',
      icon: 'calculate',
      iconBg: '#F59E0B',
      subsections: [
        {
          id: 'tem',
          title: 'TEM (Tasa Efectiva Mensual)',
          content: 'Es la tasa de interés que se aplica mensualmente sobre el saldo del préstamo. Todas las tasas (nominales o efectivas) se convierten a TEM para el cálculo de cuotas.',
          formula: 'TEM = (1 + TEA)^(1/12) - 1'
        },
        {
          id: 'metodo-frances',
          title: 'Método Francés',
          content: 'Sistema de amortización donde las cuotas son constantes durante todo el plazo. La amortización es creciente y el interés decreciente.',
          formula: 'Cuota = (S × r) / (1 - (1 + r)^(-n))\n\nDonde:\nS = Capital a financiar\nr = TEM\nn = Plazo en meses'
        },
        {
          id: 'periodo-gracia',
          title: 'Período de Gracia',
          content: 'Tiempo durante el cual el pago de la cuota se modifica. Existen 3 tipos:\n\n• Sin Gracia: Cuota normal desde el inicio\n• Gracia Parcial: Solo se pagan intereses\n• Gracia Total: No se paga nada (intereses se capitalizan)'
        },
        {
          id: 'van',
          title: 'VAN (Valor Actual Neto)',
          content: 'Indicador que mide la rentabilidad del crédito para el cliente. Un VAN positivo indica que el crédito es rentable, VAN negativo indica pérdida, y VAN cero indica neutralidad.',
          formula: 'VAN = -I₀ + Σ(Flujo_k / (1 + COK)^k)'
        },
        {
          id: 'tir',
          title: 'TIR (Tasa Interna de Retorno)',
          content: 'Tasa de descuento que hace que el VAN sea igual a cero. Representa el costo real del crédito para el cliente.',
          formula: 'VPN = -I₀ + Σ(Flujo_k / (1 + TIR)^k) = 0'
        },
        {
          id: 'tcea',
          title: 'TCEA (Tasa de Costo Efectivo Anual)',
          content: 'Tasa que incluye todos los costos del crédito: intereses, seguros, comisiones y gastos. Es la TIR expresada en términos anuales.',
          formula: 'TCEA = (1 + TIR_mensual)^12 - 1'
        },
        {
          id: 'cok',
          title: 'COK (Costo de Oportunidad del Capital)',
          content: 'Tasa de rendimiento que el cliente podría obtener en una inversión alternativa. Se usa para calcular el VAN y evaluar si el crédito es conveniente.'
        }
      ]
    },
    {
      id: 'como-usar',
      title: 'Cómo Usar el Sistema',
      icon: 'help_outline',
      iconBg: '#EF4444',
      subsections: [
        {
          id: 'registrar-clientes',
          title: '1. Gestionar Clientes',
          content:
            'Gestión de Clientes\n\n\
            Este módulo te permite administrar toda la información de las personas interesadas en adquirir una vivienda mediante el Crédito MiVivienda.\n\n\
            Funcionalidades principales:\n\
            • Ver listado de clientes: Visualiza todos los clientes asociados a tu perfil como asesor\n\
            • Acciones disponibles: Ver detalles completos, editar o eliminar un cliente\n\
            • Búsqueda rápida: Encuentra clientes por DNI, nombre o email\n\n\
            Información requerida del cliente:\n\
            • Información Personal: Datos básicos de identificación\n\
            • Situación Laboral: Datos sobre su empleo y estabilidad económica\n\
            • Información de Contacto\n\
            • Condiciones Especiales: Discapacidad, desplazado o migrante retornado'
        },

        {
          id: 'registrar-ofertas',
          title: '2. Gestionar Ofertas Inmobiliarias',
          content:
            'Gestión de Ofertas Inmobiliarias\n\n\
            Las ofertas inmobiliarias son propiedades disponibles para venta, con ubicación, características, precio y estado.\n\n\
            Funcionalidades principales:\n\
            • Ver listado de ofertas\n\
            • Acciones disponibles: Editar o eliminar ofertas\n\
            • Búsqueda avanzada: Por nombre, distrito o provincia\n\n\
            Crear una nueva oferta requiere:\n\n\
            1. Información Básica:\n\
            • Título de la propiedad\n\
            • Descripción detallada\n\n\
            2. Ubicación Completa:\n\
            • Provincia\n\
            • Distrito\n\
            • Dirección exacta\n\
            • Departamento\n\n\
            3. Características:\n\
            • Área (m²)\n\
            • Habitaciones\n\
            • Estado: En Proyecto, En Construcción, Nuevo, Segunda Mano\n\
            • Tipo: Sostenible o Tradicional\n\n\
            4. Información Financiera:\n\
            • Precio de venta\n\
            • Tipo de moneda (Soles o Dólares)'
        },

        {
          id: 'ver-entidades',
          title: '3. Consultar Entidades Financieras',
          content:
            'Entidades Financieras\n\n\
            Son instituciones autorizadas por el Fondo MiVivienda para otorgar créditos hipotecarios.\n\n\
            Explorar entidades:\n\
            • Cada entidad cuenta con un botón "Ver Detalles" con información completa\n\n\
            Información disponible por entidad:\n\n\
            Rangos de Financiamiento:\n\
            • Precio de vivienda permitido\n\
            • Monto de financiamiento\n\
            • Cuota inicial requerida\n\
            • Plazos del crédito\n\
            • Período de gracia\n\n\
            Requisitos del Cliente:\n\
            • Condiciones necesarias para calificar\n\
            • Documentación requerida\n\
            • Perfil crediticio\n\n\
            Condiciones de Vivienda:\n\
            • Si acepta viviendas usadas o solo nuevas\n\
            • Si permite financiamientos vigentes\n\
            • Restricciones especiales'
        },

        {
          id: 'iniciar-simulacion',
          title: '4. Gestión de Solicitudes de Simulación',
          content:
            'Simulación de Crédito\n\n\
            Una simulación permite calcular cómo sería un crédito para un cliente, vivienda y entidad específica.\n\n\
            Funcionalidades principales:\n\
            • Ver listado de simulaciones\n\
            • Editar, ver detalles o eliminar simulaciones\n\n\
            Crear una simulación requiere:\n\n\
            1. Selección Inicial:\n\
            • Cliente\n\
            • Oferta inmobiliaria\n\
            • Entidad financiera\n\n\
            2. Parámetros de Simulación:\n\
            • Fecha de inicio\n\
            • Moneda (Soles o Dólares)\n\
            • Tasa de interés\n\
            • COK\n\
            • Período de gracia\n\
            • Años de plazo\n\
            • Cuota inicial\n\n\
            3. Costos del Crédito:\n\n\
            Costos Iniciales:\n\
            • Gastos notariales\n\
            • Gastos registrales\n\
            • Tasación\n\
            • Comisión de estudio\n\
            • Comisión de activación\n\
            • Honorarios profesionales\n\
            • Documentación\n\n\
            Costos Periódicos:\n\
            • Comisión periódica\n\
            • Portes\n\
            • Gastos administrativos\n\
            • Seguro de desgravamen\n\
            • Seguro del inmueble\n\
            • Envío de estado de cuenta\n\n\
            Resultados de la Simulación:\n\
            • Información general\n\
            • Validación del crédito (viable o no)\n\
            • Indicadores financieros: VAN, TIR, TCEA\n\
            • Totales del crédito\n\
            • Cronograma completo mes a mes'
        },

        {
          id: 'interpretar-resultados',
          title: '5. Perfil de Asesor',
          content:
            'Perfil de Asesor Inmobiliario\n\n\
            Tu perfil contiene tu información personal y profesional para identificarte dentro del sistema.\n\n\
            Gestión del perfil:\n\
            • Ver información actual\n\
            • Editar perfil\n\n\
            Datos editables:\n\
            • Razón social\n\
            • Nombre de usuario\n\
            • RUC\n\
            • Correo electrónico\n\
            • Contraseña\n\n\
            Tip:\n\
            • Mantén tu información actualizada para mejorar tu experiencia y comunicación con clientes.'
        }
      ]
    },
    {
      id: 'glosario', // mantener
      title: 'Marco Legal del Fondo MiVivienda',
      icon: 'book',
      iconBg: '#06B6D4',
      subsections: [
        {
          id: 'glosario-a-c', // mantener
          title: 'Marco Legal',
          content:
            'El marco legal del Programa Fondo MIVIVIENDA S.A. establece su creación, funcionamiento y facultades para promover el acceso a la vivienda formal en el Perú. Incluye normas que regulan su estructura, financiamiento, subsidios, transparencia y mecanismos de apoyo social.\n\n\
            Principales normas involucradas:\n\
            • Ley N.º 26912 (1998): Crea el Fondo MIVIVIENDA para facilitar el acceso al crédito hipotecario a familias de ingresos medios y bajos.\n\
            • Ley N.º 28579 y DS 024-2005-VIVIENDA: Transforman el Fondo en una Sociedad Anónima Estatal adscrita a FONAFE, con autonomía administrativa y financiera.\n\
            • Decreto Legislativo N.º 1037 (2008): Amplía funciones e incorpora la promoción de habilitación urbana y oferta de vivienda social.\n\
            • Ley N.º 31313 (2021): Introduce enfoque de desarrollo urbano sostenible y criterios de eficiencia energética.\n\
            • Ley N.º 31613 (2022): Fortalece mecanismos de acceso al crédito para mujeres víctimas de violencia.\n\n\
            Decretos y reglamentos:\n\
            • DS N.º 011-2013-VIVIENDA: Aprueba el Reglamento del Fondo MIVIVIENDA.\n\
            • DS N.º 010-2014-VIVIENDA: Regula la emisión de bonos corporativos del Fondo.\n\
            • DS N.º 013-2015-VIVIENDA: Regula financiamiento para adquisición de terrenos.\n\
            • DS N.º 008-2022-VIVIENDA: Actualiza disposiciones sobre subsidios y apoyo económico.\n\
            • DS N.º 029-2023-PCM: Autoriza uso excepcional de fondos y bonos en regiones en emergencia.\n\n\
            Normas financieras y resoluciones:\n\
            • Resolución SBS N.º 1765-2005: Define reglas de transparencia en la contratación financiera.\n\
            • Resolución SBS N.º 8181-2012: Reglamento de Transparencia e Información al usuario.\n\
            • RM N.º 044-2013-VIVIENDA: Manual de Operaciones del Fondo MIVIVIENDA.\n\
            • RM N.º 143-2017-VIVIENDA: Regula asignación de subsidios.\n\
            • RM N.º 195-2019-VIVIENDA: Criterios de elegibilidad de beneficiarios.\n\
            • RM N.º 140-2023-VIVIENDA: Subsidios y bonos para arrendatarios y damnificados.\n\n\
            Leyes complementarias:\n\
            • Ley N.º 26702: Regula el sistema financiero y supervisión de entidades participantes.\n\
            • Ley N.º 27785: Control del uso de recursos públicos (Contraloría).\n\
            • Ley N.º 28587: Transparencia y acceso a la información pública.\n\
            • Ley N.º 28677: Inclusión financiera para sectores vulnerables.\n\
            • Ley N.º 29033: Ley del Buen Pagador, incentiva al prestatario cumplido.\n\
            • Ley N.º 30952: Crea el Nuevo Crédito MIVIVIENDA y sus lineamientos.'
        }
      ]
    }

  ];

  constructor(private router: Router) {}

  setActiveSection(sectionId: string): void {
    this.activeSection.set(sectionId);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getActiveSection(): GuideSection | undefined {
    return this.sections.find(s => s.id === this.activeSection());
  }

  goBack(): void {
    this.router.navigate(['/private/dashboard']);
  }
}
