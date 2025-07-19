import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Using signals for reactive state management
  loading = signal<boolean>(false);

  constructor() { }

  setLoading(isLoading: boolean): void {
    this.loading.set(isLoading);
  }
}
