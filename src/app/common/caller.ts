import { fromFetch } from 'rxjs/fetch';
import { SERVER_URL } from '../app.component';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  Observable,
  of,
  retry,
  switchMap,
  throwError,
  timer,
} from 'rxjs';
import { Injectable } from '@angular/core';

interface DeleteServerResponse {
  row: [];
  affected: number;
}

@Injectable({
  providedIn: 'root',
})

/*
 * The Caller class provides methods to interact with a server, performing
 * HTTP PATCH requests, GET requests with retries, and health checks.
 * NOTE: Some errors are printed out in the required way, while other has effect on the app
 * NOTE: Most method uses @Template T which indicates the server response schema
 */
export class Caller {
  // The delay time in milliseconds before retrying a failed request
  readonly DELAY_TIME: number = 3000;

  post<T>(path: string, payload: Partial<T> | T): Promise<T> {
    const call = this.baseCall(path, { method: 'POST' }, payload);
    return firstValueFrom(call);
  }

  delete(path: string): Promise<DeleteServerResponse> {
    const call = this.baseCall<DeleteServerResponse>(path, {
      method: 'DELETE',
    });
    return firstValueFrom(call);
  }

  patch<T>(path: string, payload: Partial<T>): Promise<T> {
    const call = this.baseCall<T>(path, { method: 'PATCH' }, payload);
    return firstValueFrom(call);
  }

  /*
   * Fetches data from the server and updates the provided BehaviorSubject with the result.
   * @param path - The relative path for the URL
   * @param subj - BehaviorSubject to store the server response as an observable.
   * @returns - An observable containing the server response data.
   */

  get<T>(path: string, subj: BehaviorSubject<T[]>): Observable<T[]> {
    return this.baseCall<T[]>(path).pipe(
      switchMap((res: T[]) => {
        subj.next(res);
        return of(res);
      }),
      retry({
        delay: () => {
          console.error('Retry calling for', path);
          return timer(this.DELAY_TIME); // Retry after delay
        },
      }),
    );
  }

  /*
   * Makes an HTTP request to the given path using the specified method and payload.
   * @param path - Relative URL to make the request.
   * @param options - Request method POST,PATCH etc... * GET default *
   * @param payload - Optional data to send with the request
   * @returns Observable of the server response.
   */

  private baseCall<T>(
    path: string,
    options: { method: string } = { method: 'GET' },
    payload?: T | Partial<T>,
  ): Observable<T> {
    return fromFetch(`${SERVER_URL}/${path}`, {
      method: options.method,
      body: JSON.stringify(payload) || null,
      headers: {
        'Content-Type': 'application/json',
      },
    }).pipe(
      switchMap(async (response) => {
        if (response.ok) {
          return await response.json();
        }
        return throwError(() => new Error('Failed to parse to json'));
      }),
      catchError(() => {
        throw new Error('Failed to fetch resources');
      }),
    );
  }

  /*
   * Performs a health check on the server by sending a GET request to the base URL.
   * If the server responds successfully, it returns the string 'up'.
   * Otherwise, it retries the request after a delay.
   *
   * @returns A promise that resolves to the string 'up' if the server is reachable.
   */

  private stateSubject = new BehaviorSubject<string>('');
  $state = this.stateSubject.asObservable();

  async healthCheck(): Promise<string> {
    const call = fromFetch(SERVER_URL).pipe(
      switchMap((res) => {
        if (res.ok) {
          this.stateSubject.next('up');
          return of('up');
        }
        return of('');
      }),
      retry({
        delay: () => {
          return timer(this.DELAY_TIME);
        },
      }),
    );

    // Return the result and cache the value for future calls
    return firstValueFrom(call);
  }
}
