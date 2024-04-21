import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { ListComponent } from './list/list.component';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    ListComponent,
    EditComponent,
    CommonModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
  animations: [
    trigger('editInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('500ms ease-in',style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('listInOut', [
      state('open', style({width: '100%'})),
      state('closed', style({width: '50%'})),
      transition('open => closed', [animate('.5s')]),
      transition('closed => open', [animate('.5s')])
    ]),
  ]
})
export class AccountsComponent {
  active: boolean = false;

  toggle() {
    this.active = !this.active;
  }
}
