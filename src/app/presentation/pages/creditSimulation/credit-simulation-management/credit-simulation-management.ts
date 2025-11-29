import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-credit-simulation-management',
    imports: [
        FormsModule,

    ],
  templateUrl: './credit-simulation-management.html',
  styleUrl: './credit-simulation-management.css',
})
export class CreditSimulationManagement {
  // private router = inject(Router);
  // private simulationService = inject(CreditSimulationService);
  // private snackBar = inject(MatSnackBar);
  //
  // simulations = signal<CreditApplicationFullResource[]>([]);
  // searchTerm = signal<string>('');
  // isLoading = signal<boolean>(true);
  //
  // filteredSimulations = computed(() => {
  //   const term = this.searchTerm().toLowerCase().toLowerCase().trim();
  //   if (!term) return this.simulations();
  //
  //   return this.simulations().filter(sim =>
  //     `${sim.clientFirstname} ${sim.clientLastname}`.toLowerCase().includes(term) ||
  //     sim.clientDni.includes(term) ||
  //     sim.financeEntityName.toLowerCase().includes(term) ||
  //     sim.rentIndicators.tcea.toFixed(2).includes(term)
  //   );
  // });
  //
  // ngOnInit(): void {
  //   this.loadSimulations();
  // }
  //
  // loadSimulations(): void {
  //   const companyId = localStorage.getItem('companyId');
  //   if (!companyId) {
  //     this.snackBar.open('Error: No se encontró la empresa', 'Cerrar', { duration: 4000 });
  //     return;
  //   }
  //
  //   this.isLoading.set(true);
  //   this.simulationService.getAllSimulationsByCompany(+companyId).subscribe({
  //     next: (sims) => {
  //       this.simulations.set(sims);
  //       this.isLoading.set(false);
  //     },
  //     error: (err) => {
  //       console.error('Error cargando simulaciones:', err);
  //       this.isLoading.set(false);
  //       this.snackBar.open('Error al cargar las simulaciones', 'Cerrar', {
  //         duration: 4000,
  //         panelClass: ['error-snackbar']
  //       });
  //     }
  //   });
  // }
  //
  // newSimulation(): void {
  //   this.router.navigate(['/simulacion/nueva']);
  // }
  //
  // viewSimulation(id: number): void {
  //   this.router.navigate(['/simulacion/perfil', id]);
  // }
  //
  // confirmDelete(simulation: CreditApplicationFullResource): void {
  //   const clientName = `${simulation.clientFirstname} ${simulation.clientLastname}`;
  //   const confirmed = confirm(
  //     `¿Eliminar la simulación de ${clientName} con ${simulation.financeEntityName}?\n\nEsta acción no se puede deshacer.`
  //   );
  //
  //   if (confirmed) {
  //     this.deleteSimulation(simulation.id);
  //   }
  // }
  //
  // deleteSimulation(id: number): void {
  //   this.simulationService.deleteSimulation(id).subscribe({
  //     next: () => {
  //       this.simulations.update(list => list.filter(s => s.id !== id));
  //       this.snackBar.open('Simulación eliminada correctamente', 'Cerrar', {
  //         duration: 3000,
  //         panelClass: ['success-snackbar']
  //       });
  //     },
  //     error: () => {
  //       this.snackBar.open('Error al eliminar la simulación', 'Cerrar', {
  //         duration: 4000,
  //         panelClass: ['error-snackbar']
  //       });
  //     }
  //   });
  // }
  //
  // formatAmount(value: number): string {
  //   return value.toLocaleString('es-PE', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2
  //   });
  // }
  //
  // onSearch(): void {
  //   // Reactivo automático gracias a computed
  // }
}
