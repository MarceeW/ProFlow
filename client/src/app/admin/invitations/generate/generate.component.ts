import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvitationService } from '../../../_services/invitation.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { take } from 'rxjs';
import { InvitationLinkPipe } from '../../../_pipes/invitation-link.pipe';


@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    InvitationLinkPipe
  ],
  templateUrl: './generate.component.html',
  styleUrl: './generate.component.css'
})
export class GenerateComponent implements OnInit {

  inviteKey: null | string = null
  inviteForm = new FormGroup(
    {
      date: new FormControl(new Date()),
    }
  );
  minInviteDate = new Date();
  @Output() generateEvent: EventEmitter<null> = new EventEmitter();

  constructor(private invitationService: InvitationService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.minInviteDate.setDate(this.minInviteDate.getDate() + 1);
    this.inviteForm.get("date")?.setValue(this.minInviteDate);
  }

  generateInvitation() {
    const dateControl = this.inviteForm.get("date");
    const date: Date | null | undefined = dateControl?.value;

    if (!date) {
      this.toastr.error("Choose a date!")
      return;
    }
    if (date < this.minInviteDate) {
      this.toastr.error("The invitation expiration date only can be a future date!")
      return;
    }

    date.setUTCHours(23);
    date.setUTCMinutes(59);
    date.setUTCSeconds(59);

    this.generateEvent.emit();

    this.invitationService.generateInvitation(date).pipe(take(1))
      .subscribe({
        next: invite => this.inviteKey = invite.key
      });
  }
}
