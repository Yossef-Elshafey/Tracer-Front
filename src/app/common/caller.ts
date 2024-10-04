import { fromFetch } from "rxjs/fetch";
import { SERVER_URL } from "../app.component";
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  retry,
  switchMap,
  throwError,
  timer,
} from "rxjs";

/*
 * @Param path => the path for url to excute
 * @Param subj => subject to be used as an observable
 *
 * @Return observable of the server response
 *
 * @Purpose calling the server until being up
 *
 * */
export class Caller {
  call<T>(path: string, subj: BehaviorSubject<T[]>): Observable<T[]> {
    return fromFetch(`${SERVER_URL}/${path}`).pipe(
      switchMap(async (response) => {
        if (response.ok) {
          const res = await response.json();
          subj.next(res);
          return res;
        } else {
          return throwError(() => new Error("Server responded with error"));
        }
      }),
      retry({
        delay: () => {
          console.error("Retry calling for", path);
          return timer(3000); // Retry after 3 seconds
        },
      }),
      catchError(() => {
        return of([]);
      }),
    );
  }
}
