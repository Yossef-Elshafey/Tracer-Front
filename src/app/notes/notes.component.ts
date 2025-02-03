import { Component, OnInit } from '@angular/core';
import { NotesService } from '../services/notes.service';
import { Note } from '../types/interface';
import { Caller } from '../common/caller';
import { CommonModule } from '@angular/common';
import { PopupStatusService } from '../services/popup-status.service';
import { PopupEnum } from '../types/enums/PopupEnum';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, PopupComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent implements OnInit {
  constructor(
    private noteService: NotesService,
    private caller: Caller,
    private popupService: PopupStatusService,
  ) {}

  notes: Note[] = [];
  singleNote = {} as Note;
  serverState = '';
  popupEnum = PopupEnum;

  ngOnInit(): void {
    this.noteService.fetchNotes().subscribe();
    this.noteService.$notes.subscribe((notes) => {
      this.notes = notes;
    });
    this.caller.$state.subscribe((state) => {
      this.serverState = state;
    });
  }

  displaySingleNote(id: number) {
    this.popupService.show(this.popupEnum.DISPLAY_NOTE);
    if (this.notes) {
      this.singleNote = this.notes.find((note) => note.id === id) as Note;
    }
  }

  showAddNote() {
    this.popupService.show(this.popupEnum.ADD_NOTE);
  }

  addNote(inp: HTMLTextAreaElement) {
    this.noteService.addNote(inp.value);
    this.popupService.remove(this.popupEnum.ADD_NOTE);
    inp.value = '';
  }

  deleteNote(id: number) {
    this.noteService.delete(id);
    this.popupService.remove(this.popupEnum.DISPLAY_NOTE);
  }
}
