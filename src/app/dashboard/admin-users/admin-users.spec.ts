import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { AdminUsers } from './admin-users';

describe('AdminUsers', () => {
  let component: AdminUsers;
  let fixture: ComponentFixture<AdminUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminUsers,
        NoopAnimationsModule,
        MatSnackBarModule,
        MatDialogModule,
        FormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load mock users on init', () => {
    expect(component.users.length).toBeGreaterThan(0);
  });

  it('should filter users correctly', () => {
    component.searchTerm = 'Juan';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toContain('Juan');
  });

  it('should filter by role', () => {
    component.selectedRole = 'admin';
    component.filterUsers();
    const adminUsers = component.filteredUsers.filter(user => user.role === 'admin');
    expect(adminUsers.length).toBe(component.filteredUsers.length);
  });

  it('should filter by status', () => {
    component.selectedStatus = 'active';
    component.filterUsers();
    const activeUsers = component.filteredUsers.filter(user => user.status === 'active');
    expect(activeUsers.length).toBe(component.filteredUsers.length);
  });

  it('should get correct admin count', () => {
    const adminCount = component.getAdminCount();
    const expectedCount = component.users.filter(user => user.role === 'admin').length;
    expect(adminCount).toBe(expectedCount);
  });

  it('should get correct active users count', () => {
    const activeCount = component.getActiveUsers();
    const expectedCount = component.users.filter(user => user.status === 'active').length;
    expect(activeCount).toBe(expectedCount);
  });

  it('should get correct modules count', () => {
    const modulesCount = component.getModulesCount();
    expect(modulesCount).toBe(component.availableModules.length);
  });

  it('should get correct role label', () => {
    expect(component.getRoleLabel('admin')).toBe('Administrador');
    expect(component.getRoleLabel('user')).toBe('Usuario');
    expect(component.getRoleLabel('viewer')).toBe('Solo lectura');
  });

  it('should track users by id', () => {
    const user = component.users[0];
    const trackResult = component.trackByUserId(0, user);
    expect(trackResult).toBe(user.id);
  });

  it('should toggle user status', () => {
    const user = component.users[0];
    const originalStatus = user.status;
    component.toggleUserStatus(user);
    expect(user.status).not.toBe(originalStatus);
  });

  it('should clear filters', () => {
    component.searchTerm = 'test';
    component.selectedRole = 'admin';
    component.selectedStatus = 'active';
    
    component.clearFilters();
    
    expect(component.searchTerm).toBe('');
    expect(component.selectedRole).toBe('');
    expect(component.selectedStatus).toBe('');
  });

  it('should delete user when confirmed', () => {
    const initialLength = component.users.length;
    const user = component.users[0];
    
    // Mock confirm to return true
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.deleteUser(user);
    
    expect(component.users.length).toBe(initialLength - 1);
    expect(component.users.find(u => u.id === user.id)).toBeUndefined();
  });

  it('should not delete user when not confirmed', () => {
    const initialLength = component.users.length;
    const user = component.users[0];
    
    // Mock confirm to return false
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteUser(user);
    
    expect(component.users.length).toBe(initialLength);
  });
});
