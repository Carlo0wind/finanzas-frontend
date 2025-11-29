import {Component, computed, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';

export interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLinkActive,
    RouterLink,
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    MatMenuItem
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);

  isMenuOpen = false;
  showMobileMenu = false;

  navItems: NavItem[] = [
    { label: 'Clientes', route: 'clientes' },
    { label: 'Ofertas', route: 'ofertas' },
    { label: 'Entidades Financieras', route: 'entidades-financieras' },
    { label: 'Simulador', route: 'simulador/gestion' }
  ];

  // signals eran esto, gracias claudesito
  userName = computed(() => {
    const companyName = localStorage.getItem('companyName');
    const username = localStorage.getItem('username');
    return companyName || username || 'Usuario';
  });

  userEmail = computed(() => {
    return localStorage.getItem('companyEmail') || 'correo@ejemplo.com';
  });

  userInitial = computed(() => {
    const name = this.userName();
    return name.charAt(0).toUpperCase();
  });

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  editProfile(): void {
    this.router.navigate(['/private/profile/edit']);
  }

  logout(): void {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      localStorage.clear();

      this.router.navigate(['login']);
    }
  }
}
