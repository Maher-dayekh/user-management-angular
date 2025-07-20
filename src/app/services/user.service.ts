import { Injectable, signal } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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

    const headers = new HttpHeaders({
      'x-api-key': 'reqres-free-v1'
    });

    this.loadingService.setLoading(true);

    return this.http.get<UserListResponse>(`${this.apiUrl}?page=${page}`, { headers }).pipe(
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

    // 2. If not cached, fetch from API directly
    this.loadingService.setLoading(true);

    const headers = new HttpHeaders({
      'x-api-key': 'reqres-free-v1'
    });

    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`, { headers }).pipe(
      tap(response => {
        this.userCache.set(response.data.id, response.data);
        this.currentUser.set(response.data);
        this.loadingService.setLoading(false);
      })
    );
  }


  searchUserById(id: number): Observable<UserResponse | null> {
    if (!id) {
      return of(null);
    }
    return this.getUserById(id);
  }
}
