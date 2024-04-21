import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../_models/user';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {

  @Output()
  closeEvent = new EventEmitter<null>();

  @Input()
  model: User | null = null;

  onClose() {
    this.closeEvent.emit();
  }
}
