import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of, switchMap, tap} from 'rxjs';
import { User, UserListResponse, UserResponse } from '../models/user.model';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://reqres.in/api/users';
  private userCache = new Map<number, User>();
  private pageCache = new Map<number, UserListResponse>();

  // Using signals for reactive state management
  currentUser = signal<User | null>(null);

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  getUsers(page: number): Observable<UserListResponse> {
    // Check if we have cached data for this page
    if (this.pageCache.has(page)) {
      return of(this.pageCache.get(page) as UserListResponse);
    }

    this.loadingService.setLoading(true);
    return this.http.get<UserListResponse>(`${this.apiUrl}?page=${page}`).pipe(
      tap(response => {
        // Cache the page data
        this.pageCache.set(page, response);

        // Cache individual users
        response.data.forEach(user => {
          this.userCache.set(user.id, user);
        });

        this.loadingService.setLoading(false);
      })
    );
  }

  getUserById(id: number): Observable<UserResponse> {
    // 1. Return from cache if available
    if (this.userCache.has(id)) {
      const user = this.userCache.get(id) as User;
      this.currentUser.set(user);
      return of({ data: user });
    }

    // 2. If not cached, scan all pages until user is found
    this.loadingService.setLoading(true);

    // Simulate page scanning from 1 to max known pages (assume 2 pages for reqres.in)
    const maxPagesToScan = 2;
    let currentPage = 1;

    const tryNextPage = (): Observable<UserResponse> => {
      return this.getUsers(currentPage).pipe(
        tap(() => currentPage++),
        // Use switchMap to try again if not found after caching
        switchMap(() => {
          if (this.userCache.has(id)) {
            const user = this.userCache.get(id) as User;
            this.currentUser.set(user);
            this.loadingService.setLoading(false);
            return of({ data: user });
          }

          if (currentPage <= maxPagesToScan) {
            return tryNextPage(); // Try next page
          } else {
            this.loadingService.setLoading(false);
            throw new Error(`User with ID ${id} not found.`);
          }
        })
      );
    };

    return tryNextPage();
  }


  searchUserById(id: number): Observable<UserResponse | null> {
    if (!id) {
      return of(null);
    }
    return this.getUserById(id);
  }
}
