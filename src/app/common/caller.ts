import { fromFetch } from 'rxjs/fetch';
import { SERVER_URL } from '../app.component';
import {
  BehaviorSubject,
  firstValueFrom,
  Observable,
  of,
  retry,
  switchMap,
  timer,
} from 'rxjs';

/**
 * The Caller class provides methods to interact with a server, performing
 * HTTP PATCH requests, GET requests with retries, and health checks.
 * It utilizes RxJS observables and reactive patterns for handling asynchronous
 * server communication.
 *
 * NOTE: Necessary logical errors,logs are handled while others take direct effect on the app
 *       for a clear console as possible
 */
export class Caller {
  // The delay time in milliseconds before retrying a failed request
  readonly DELAY_TIME: number = 3000;

  /**
   * @template T - The type of the response expected from the server.
   * @param path - The relative path for the URL
   * @param payload - Partial Object of T as JSON object to be patched
   * @returns A promise resolving with the server's response as a JSON object of type T.
   */

  patch<T>(path: string, payload: Partial<T>): Promise<T> {
    const call = fromFetch(`${SERVER_URL}/${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).pipe(
      switchMap(async (response) => {
        if (response.ok) {
          return await response.json();
        }
        return of([]);
      }),
    );
    return firstValueFrom(call);
  }

  /**
   * Fetches data from the server and updates the provided BehaviorSubject with the result.
   * The method retries the request after a delay if it fails, and will log errors to the console.
   *
   * @template T - The type of the data expected from the server.
   * @param path - The relative path for the URL
   * @param subj - BehaviorSubject to store the server response as an observable.
   * @returns - An observable containing the server response data.
   */
  getDataFor<T>(path: string, subj: BehaviorSubject<T[]>): Observable<T[]> {
    return fromFetch(`${SERVER_URL}/${path}`).pipe(
      switchMap(async (response) => {
        if (response.ok) {
          const res = await response.json();
          subj.next(res);
          return res;
        }
      }),
      retry({
        delay: () => {
          console.error('Retry calling for', path);
          return timer(this.DELAY_TIME); // Retry after 3 seconds
        },
      }),
    );
  }

  /**
   * Performs a health check on the server by sending a GET request to the base URL.
   * If the server responds successfully, it returns the string 'up'.
   * Otherwise, it retries the request after a delay.
   *
   * @returns A promise that resolves to the string 'up' if the server is reachable.
   */

  async healthCheck(): Promise<string> {
    const call = fromFetch(SERVER_URL).pipe(
      switchMap((res) => {
        if (res.ok) {
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

    return firstValueFrom(call);
  }
}
