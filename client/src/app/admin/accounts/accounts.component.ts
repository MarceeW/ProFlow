import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, effect, model, signal, untracked, viewChild } from '@angular/core';
import { BaseComponent } from '../../_component-base/base.component';
import { Account } from '../../_models/account';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountManageComponent } from './account-manage/account-manage.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    AccountListComponent,
    AccountManageComponent,
    CommonModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  animations: [
    trigger('openClose', [
      state('open', style({
        display: 'flex',
        right: '0',
      })),
      state('closed', style({
        right: '-50vmin',
      })),
      transition('open => closed', [
        animate('.2s')
      ]),
      transition('closed => open', [
        animate('.1s')
      ]),
    ]),
  ],
})
export class AccountsComponent extends BaseComponent {
  readonly editedAccount = model<Account>();
  readonly managePanelOpened = signal<boolean>(false);
  readonly accountList = viewChild<AccountListComponent>(AccountListComponent);

  constructor() {
    super();
  }

  onPanelClose(changeHappened: boolean) {
    this.managePanelOpened.set(false);
    if(changeHappened)
      this.accountList()?.refresh();
  }

  onManageEvent(account: Account) {
    this.managePanelOpened.set(true);
    this.editedAccount.set(account);
  }
}
