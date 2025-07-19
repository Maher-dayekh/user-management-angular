import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIcon
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users = signal<User[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(0);
  totalUsers = signal<number>(0);
  pageSize = signal<number>(0);

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers(this.currentPage());
  }

  loadUsers(page: number): void {
    this.userService.getUsers(page).subscribe(response => {
      this.users.set(response.data);
      this.totalPages.set(response.total_pages);
      this.totalUsers.set(response.total);
      this.pageSize.set(response.per_page);
    });
  }

  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    this.currentPage.set(page);
    this.loadUsers(page);
  }

  viewUserDetails(userId: number): void {
    this.router.navigate(['/users', userId]);
  }
}
