import { AfterViewInit, Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: 'img[user-picture]',
  standalone: true
})
export class UserPictureDirective implements AfterViewInit {
  readonly userId = input.required<string>({alias: 'user-picture'});
  readonly size = input<number>(32);

  private readonly _host = inject(ElementRef);
  private readonly _renderer = inject(Renderer2);
  private readonly _accountService = inject(AccountService);

  ngAfterViewInit(): void {
    const imgElement = this._host.nativeElement;
    this._renderer.setAttribute(imgElement, 'src', this.getPictureSrc());
    this._renderer.setAttribute(imgElement, 'width', this.size().toString());
    this._renderer.setAttribute(imgElement, 'height', this.size().toString());
    this._renderer.addClass(imgElement, 'user-picture');
  }

  getPictureSrc() {
    return this._accountService
      .getAccountProfilePictureSource(this.userId());
  }
}
