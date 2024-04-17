import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invitationLink',
  standalone: true
})
export class InvitationLinkPipe implements PipeTransform {

  transform(inviteKey: string): string {
    return window.origin + "/register?invitationKey=" + inviteKey;
  }
}
