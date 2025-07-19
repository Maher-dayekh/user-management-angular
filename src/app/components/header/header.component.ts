import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchId = signal<string>('');
  searchResult = signal<User | null>(null);
  showResult = signal<boolean>(false);

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  searchUser(): void {
    const id = parseInt(this.searchId());
    if (!id || isNaN(id)) {
      this.searchResult.set(null);
      this.showResult.set(false);
      return;
    }

    this.userService.searchUserById(id).subscribe(response => {
      if (response) {
        this.searchResult.set(response.data);
        this.showResult.set(true);
      } else {
        this.searchResult.set(null);
        this.showResult.set(true);
      }
    });
  }

  navigateToUser(id: number): void {
    this.router.navigate(['/users', id]);
    this.resetSearch();
  }

  navigateToHome(): void {
    this.router.navigate(['/users']);
    this.resetSearch();
  }

  resetSearch(): void {
    this.searchId.set('');
    this.searchResult.set(null);
    this.showResult.set(false);
  }
}
