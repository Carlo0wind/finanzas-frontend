import {Component, computed, signal} from '@angular/core';
import {FinanceEntity} from '../../../model/financeEntity.model';
import {FinanceEntityService} from '../../../services/finance-entity-service';
import {Router} from '@angular/router';
import {
  FinanceEntityCardComponent
} from '../../shared/components/finance-entity-card-component/finance-entity-card-component';
import {MatDialog} from '@angular/material/dialog';
import {
  FinanceEntityModalDetails
} from '../../shared/components/finance-entity-modal-details/finance-entity-modal-details';

@Component({
  selector: 'app-finance-entities',
  imports: [
    FinanceEntityCardComponent
  ],
  templateUrl: './finance-entities.html',
  styleUrl: './finance-entities.css',
})
export class FinanceEntities {
  private allEntities = signal<FinanceEntity[]>([]);
  isLoading = signal(true);

  groupedEntities = computed(() => [
    { type: 'BANCA_MULTIPLE', label: 'Banca Múltiple', entities: this.bancaMultiple() },
    { type: 'CMAC', label: 'Cajas Municipales (CMAC)', entities: this.cmac() },
    { type: 'FINANCIERA', label: 'Financieras', entities: this.financieras() },
    { type: 'EMPRESA_DE_CREDITO', label: 'Empresas de Crédito', entities: this.empresasCredito() }
  ].filter(g => g.entities.length > 0));

  bancaMultiple = computed(() =>
    this.allEntities().filter(e => e.type === 'BANCA_MULTIPLE')
  );
  cmac = computed(() =>
    this.allEntities().filter(e => e.type === 'CMAC')
  );
  financieras = computed(() =>
    this.allEntities().filter(e => e.type === 'FINANCIERA')
  );
  empresasCredito = computed(() =>
    this.allEntities().filter(e => e.type === 'EMPRESA_DE_CREDITO')
  );

  constructor(
    private financeEntityService: FinanceEntityService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loadEntities();
  }

  loadEntities() {
    this.financeEntityService.getAllFinanceEntities().subscribe({
      next: (entities) => {
        this.allEntities.set(entities);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openEntityDetails(entityId: number): void {
    const entity = this.allEntities().find(e => e.id === entityId);
    if (!entity) return;

    this.dialog.open(FinanceEntityModalDetails, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        entity: entity,
        selectable: false
      },
      panelClass: 'finance-entity-modal'
    });
  }
}
