import { Injectable } from '@angular/core';
import { Caller } from '../common/caller';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from '../types/interface';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private caller: Caller) {}

  noteSubject: BehaviorSubject<Note[]> = new BehaviorSubject([] as Note[]);
  $notes = this.noteSubject.asObservable();

  fetchNotes(): Observable<Note[]> {
    return this.caller.get<Note>('note', this.noteSubject);
  }

  async delete(id: number): Promise<void> {
    const res = await this.caller.delete(`note/${id}`);

    if (res.affected) {
      const curr = this.noteSubject.getValue().filter((note) => note.id !== id);
      this.noteSubject.next(curr);
    }
  }

  async addNote(note: string) {
    const res = await this.caller.post<Note>('note', { note: note });
    if (res.id) {
      const curr = this.noteSubject.getValue();
      curr.push(res);
    }
  }
}
