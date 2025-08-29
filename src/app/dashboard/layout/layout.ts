import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, Sidebar, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  isSidebarHidden = false;
  isMobile = window.innerWidth < 768;

  constructor() {
    this.checkWindowSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWindowSize();
  }

  checkWindowSize() {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.isSidebarHidden = false; // Always show sidebar on desktop
    } else {
      this.isSidebarHidden = true; // Hide sidebar by default on mobile
    }
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
