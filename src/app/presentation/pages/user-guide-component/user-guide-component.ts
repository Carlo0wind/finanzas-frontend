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
          title: '1. Registrar Clientes',
          content: 'Accede a "Registrar Clientes" desde el panel de control. Completa los datos personales, información laboral (tipo de trabajo, años de experiencia, salario) y datos adicionales (historial crediticio, financiamiento vigente). Esta información se usará para validar requisitos de las entidades financieras.'
        },
        {
          id: 'registrar-ofertas',
          title: '2. Registrar Ofertas',
          content: 'Accede a "Registrar Ofertas" para agregar propiedades disponibles. Incluye ubicación completa (departamento, provincia, distrito), precio, tipo de vivienda (casa/departamento), estado (nueva/usada/en proyecto) y características adicionales.'
        },
        {
          id: 'ver-entidades',
          title: '3. Consultar Entidades Financieras',
          content: 'En "Ver Entidades Financieras" puedes consultar el directorio completo de las 18 entidades autorizadas. Cada entidad muestra sus requisitos específicos: montos mínimos/máximos, tasas de interés, requisitos de cliente y condiciones especiales.'
        },
        {
          id: 'iniciar-simulacion',
          title: '4. Iniciar Simulación',
          content: 'En "Iniciar Simulación" sigue estos pasos:\n\n1. Selecciona el cliente\n2. Selecciona la vivienda\n3. Selecciona la entidad financiera\n4. Configura parámetros: plazo, cuota inicial, moneda, tasas, período de gracia, bono, costos iniciales y periódicos\n5. Genera la simulación\n6. Revisa los resultados'
        },
        {
          id: 'interpretar-resultados',
          title: '5. Interpretar Resultados',
          content: 'Los resultados muestran:\n\n• Banner de calificación (aprobado/rechazado)\n• Datos de entrada configurados\n• Indicadores financieros (COK, TIR, TCEA, VAN)\n• Totales del crédito\n• Cronograma de pagos detallado\n\nSi el cliente NO cumple requisitos, solo se muestran los datos de entrada con el mensaje de rechazo.'
        },
        {
          id: 'comparar-simulaciones',
          title: '6. Comparar Simulaciones',
          content: 'Puedes crear múltiples simulaciones con diferentes entidades financieras o parámetros para el mismo cliente y vivienda. Esto permite comparar cuál opción es más conveniente según el VAN, TCEA y cuota mensual.'
        }
      ]
    },
    {
      id: 'costos',
      title: 'Costos del Crédito',
      icon: 'payments',
      iconBg: '#8B5CF6',
      subsections: [
        {
          id: 'costos-iniciales',
          title: 'Costos Iniciales',
          content: 'Son gastos que se pagan una sola vez al inicio del crédito:\n\n• Gastos Notariales\n• Gastos Registrales\n• Tasación\n• Comisión de Estudio\n• Comisión de Activación\n• Honorarios Profesionales\n• Documentación'
        },
        {
          id: 'costos-periodicos',
          title: 'Costos Periódicos',
          content: 'Son gastos que se pagan mensualmente:\n\n• Comisión Periódica (fija)\n• Portes (fijo)\n• Gastos Administrativos (fijo)\n• Seguro de Desgravamen (% sobre saldo)\n• Seguro de Riesgo (% sobre saldo)\n• Envío de Estado de Cuenta (fijo)'
        },
        {
          id: 'seguros',
          title: 'Seguros Obligatorios',
          content: 'Seguro de Desgravamen: Cubre el saldo del crédito en caso de fallecimiento o invalidez del titular. Se calcula como porcentaje sobre el saldo.\n\nSeguro de Riesgo: Protege la vivienda contra daños (incendio, terremoto, etc.). También se calcula como porcentaje sobre el saldo.'
        }
      ]
    },
    {
      id: 'glosario',
      title: 'Glosario',
      icon: 'book',
      iconBg: '#06B6D4',
      subsections: [
        {
          id: 'glosario-a-c',
          title: 'A - C',
          content: '• Amortización: Parte del pago que reduce el capital pendiente\n• Capitalización: Frecuencia con que los intereses se agregan al capital\n• COK: Costo de Oportunidad del Capital\n• Cronograma: Plan detallado de pagos mes a mes\n• Cuota Inicial: Porcentaje del precio que paga el cliente al inicio'
        },
        {
          id: 'glosario-d-m',
          title: 'D - M',
          content: '• Desgravamen: Seguro que cubre el saldo en caso de fallecimiento\n• Entidad Financiera: Banco o institución autorizada para otorgar créditos\n• Flujo de Caja: Movimiento de dinero (entradas y salidas)\n• Gracia: Período donde el pago se modifica\n• Método Francés: Sistema de cuotas constantes'
        },
        {
          id: 'glosario-n-z',
          title: 'N - Z',
          content: '• Nominal: Tasa que no incluye capitalización\n• Plazo: Tiempo total del crédito en meses\n• Saldo: Capital pendiente de pago\n• TCEA: Tasa de Costo Efectivo Anual\n• TEM: Tasa Efectiva Mensual\n• TIR: Tasa Interna de Retorno\n• UIT: Unidad Impositiva Tributaria\n• VAN: Valor Actual Neto'
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
