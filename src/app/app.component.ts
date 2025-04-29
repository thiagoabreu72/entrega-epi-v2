import { Colaborador } from './interfaces/colaborador.interface';
import { Component, ViewChild } from '@angular/core';
import { Epi } from './interfaces/epi.interface';
import { ToastComponent } from './toast/toast.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Entrega EPI';
  carregandoDados = false;
  foto: string;
  dadosEpis: Epi;
  dadosColaborador: Colaborador;
  dadosRM: any;
  textoAlerta: string = '';
  tipoAlerta: number = 0;
  habilitarProtocolo: boolean = false;
  codigoRM: string = '';

  // Obtem a foto do colaborador
  capturaValor(valor: string) {
    this.foto = valor;
    //this.carregandoDados = true;
  }

  capturaValorEpis(dados: any) {
    this.dadosEpis = dados;
    //this.carregandoDados = true;
  }

  capturaValorColaborador(dados: any) {
    this.dadosColaborador = dados;
  }

  capturaValorCarregando(habilita: boolean) {
    this.carregandoDados = habilita;
  }

  capturaDadosRM(dados: any) {
    this.dadosRM = dados;
  }

  capturaTextoAlerta(texto: string) {
    this.textoAlerta = texto;
  }
  capturaHabilitacao(valor: boolean) {
    this.habilitarProtocolo = valor;
  }

  capturaCodigoRM(valor: string) {
    this.codigoRM = valor;
  }

  capturaTipoAlertas(tipo: number) {
    this.tipoAlerta = tipo;
    if (tipo === 1) {
      this.showSuccess();
    } else if (tipo === 2) {
      this.showError();
    } else if (tipo === 3) {
      this.showInfo();
    }
  }

  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  showSuccess() {
    this.toastComponent.showToast(`Sucesso! ${this.textoAlerta}`, 'success');
  }

  showError() {
    this.toastComponent.showToast(`Erro! ${this.textoAlerta}`, 'error');
  }

  showWarning() {
    this.toastComponent.showToast(`Aviso! ${this.textoAlerta}`, 'warning');
  }

  showInfo() {
    this.toastComponent.showToast(`Informação! ${this.textoAlerta}`, 'info');
  }
}
