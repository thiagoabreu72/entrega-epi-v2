import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SelecaoComponent } from './selecao/selecao.component';
import { TabelaComponent } from './tabela/tabela.component';
import { FotoComponent } from './foto/foto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { AlertasComponent } from './alertas/alertas.component';
import { ToastComponent } from './toast/toast.component';
import { TelaProtocoloComponent } from './tela-protocolo/tela-protocolo.component';

@NgModule({
  declarations: [
    AppComponent,
    SelecaoComponent,
    TabelaComponent,
    FotoComponent,
    SpinnerComponent,
    AlertasComponent,
    ToastComponent,
    TelaProtocoloComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
