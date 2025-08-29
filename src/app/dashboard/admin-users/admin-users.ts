import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive';
  modules: string[];
  createdAt: Date;
  lastLogin?: Date;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss'
})
export class AdminUsers implements OnInit {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Data
  users: User[] = [];
  filteredUsers: User[] = [];
  
  // Filters
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';

  // Available modules
  availableModules = [
    'Dashboard',
    'Calculadora',
    'Proyectos',
    'Rubros',
    'Reportes',
    'Equipo',
    'Permisos',
    'Configuración'
  ];

  ngOnInit(): void {
    this.loadMockUsers();
    this.filterUsers();
  }

  loadMockUsers(): void {
    this.users = [
      {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan.perez@empresa.com',
        company: 'Constructora ABC',
        role: 'admin',
        status: 'active',
        modules: ['Dashboard', 'Calculadora', 'Proyectos', 'Rubros', 'Reportes', 'Equipo', 'Permisos', 'Configuración'],
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date('2024-08-27')
      },
      {
        id: '2',
        name: 'María García',
        email: 'maria.garcia@empresa.com',
        company: 'Constructora ABC',
        role: 'user',
        status: 'active',
        modules: ['Dashboard', 'Calculadora', 'Proyectos'],
        createdAt: new Date('2024-02-20'),
        lastLogin: new Date('2024-08-26')
      },
      {
        id: '3',
        name: 'Carlos López',
        email: 'carlos.lopez@empresa.com',
        company: 'Ingeniería XYZ',
        role: 'viewer',
        status: 'active',
        modules: ['Dashboard', 'Reportes'],
        createdAt: new Date('2024-03-10'),
        lastLogin: new Date('2024-08-25')
      },
      {
        id: '4',
        name: 'Ana Martínez',
        email: 'ana.martinez@empresa.com',
        role: 'user',
        status: 'inactive',
        modules: ['Dashboard', 'Calculadora'],
        createdAt: new Date('2024-04-05'),
        lastLogin: new Date('2024-08-20')
      }
    ];
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.company && user.company.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  getAdminCount(): number {
    return this.users.filter(user => user.role === 'admin').length;
  }

  getActiveUsers(): number {
    return this.users.filter(user => user.status === 'active').length;
  }

  getModulesCount(): number {
    return this.availableModules.length;
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'admin': 'Administrador',
      'user': 'Usuario',
      'viewer': 'Solo lectura'
    };
    return labels[role] || role;
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  openAddUserDialog(): void {
    this.snackBar.open('Funcionalidad de agregar usuario próximamente', 'Cerrar', {
      duration: 3000
    });
  }

  editUser(user: User): void {
    this.snackBar.open(`Editando usuario: ${user.name}`, 'Cerrar', {
      duration: 3000
    });
  }

  managePermissions(user: User): void {
    this.snackBar.open(`Gestionando permisos de: ${user.name}`, 'Cerrar', {
      duration: 3000
    });
  }

  toggleUserStatus(user: User): void {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    this.snackBar.open(
      `Usuario ${user.status === 'active' ? 'activado' : 'desactivado'}: ${user.name}`, 
      'Cerrar', 
      { duration: 3000 }
    );
  }

  deleteUser(user: User): void {
    if (confirm(`¿Estás seguro de eliminar al usuario ${user.name}?`)) {
      const index = this.users.findIndex(u => u.id === user.id);
      if (index > -1) {
        this.users.splice(index, 1);
        this.filterUsers();
        this.snackBar.open(`Usuario eliminado: ${user.name}`, 'Cerrar', {
          duration: 3000
        });
      }
    }
  }

  refreshUsers(): void {
    this.loadMockUsers();
    this.filterUsers();
    this.snackBar.open('Lista de usuarios actualizada', 'Cerrar', {
      duration: 2000
    });
  }

  exportUsers(): void {
    this.snackBar.open('Exportando usuarios...', 'Cerrar', {
      duration: 3000
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.filterUsers();
  }
}