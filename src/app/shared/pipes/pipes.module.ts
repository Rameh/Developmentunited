// Modules 3rd party
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pipes
import { YearPipeComponent } from './year-pipe.component';
import { DatePipeComponent } from './date-pipe.component';
import { TitleCasePipeComponent } from './titlecase-pipe.component';
import { AsyncObservablePipeComponent } from './async-observable-pipe.component';
import { CurrencyPipeComponent } from './currency-pipe.component';
import { JsonPipeComponent } from './json-pipe.component';
import { SearchFilterPipe } from './searchfilter-pipe.component';

@NgModule({
  declarations: [
    YearPipeComponent,
    DatePipeComponent,
    TitleCasePipeComponent,
    AsyncObservablePipeComponent,
    CurrencyPipeComponent,
    JsonPipeComponent,
    SearchFilterPipe

  ],
  imports: [
    CommonModule
  ],
  exports: [
    YearPipeComponent,
    DatePipeComponent,
    TitleCasePipeComponent,
    AsyncObservablePipeComponent,
    CurrencyPipeComponent,
    JsonPipeComponent,
    SearchFilterPipe
  ]
})
export class PipesModule {
}
