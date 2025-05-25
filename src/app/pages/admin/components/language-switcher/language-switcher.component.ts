import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TuiDropdown, TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper, TuiSelect } from '@taiga-ui/kit';
import { stringifyLabelSelectHasTranslate } from './../../utils/functions/ui-utils';
import { tuiTakeUntilDestroyed } from '@taiga-ui/cdk';

@Component({
  selector: 'app-language-switcher',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiChevron, 
    TuiDataListWrapper, 
    TuiSelect,
    TuiTextfield,
    TuiDropdown,
    TranslocoModule,
    TranslocoDirective
  ],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent implements OnInit {
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  languages = [
    { value: 'en', label: 'language.en' },
    { value: 'vi', label: 'language.vi' },
  ];

  languageControl = new FormControl(this.currentLang);

  readonly stringifyLabelSelectHasTranslate = stringifyLabelSelectHasTranslate(this.transloco);

  openSelectLang = false;

  ngOnInit(): void {
    this.languageControl.valueChanges.pipe(tuiTakeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.setLang(value?.value ?? this.languages[0].value);
    })
  }

  setLang(lang: string): void {
    this.transloco.setActiveLang(lang);
  }

  get currentLang() {
    return this.languages.find((lang) => lang.value === this.transloco.getActiveLang())!;
  }
}
