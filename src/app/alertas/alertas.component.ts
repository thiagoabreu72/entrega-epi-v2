import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss'],
})
export class AlertasComponent implements OnChanges {
  @Input() textoAlerta: string = '';
  @Input() tipoAlerta: number = 0;

  classes: string = 'hidden';
  classeBotao = '';
  mostrar: boolean = false;

  constructor() {}

  ngOnChanges(alteracao: SimpleChanges) {
    if (
      alteracao.textoAlerta.currentValue !==
        alteracao.textoAlerta.previousValue &&
      alteracao.textoAlerta.currentValue !== '' &&
      alteracao.textoAlerta.currentValue !== 'NOVA'
    ) {
      this.mudaClasse(this.tipoAlerta, alteracao.textoAlerta.currentValue);
    }
  }

  mudaClasse(tipo: number, texto: string) {
    this.textoAlerta = texto;
    this.tipoAlerta = tipo;
    this.mostrar = true;
    if (tipo === 1) {
      this.classes =
        'alertAnimado alert alert-success alert-dismissible fade show';
    } else if (tipo === 2) {
      this.classes =
        'alertAnimado alert alert-danger alert-dismissible fade show';
    } else if (tipo === 3) {
      //this.classes = 'alertAnimado alert-primary';
      this.classes = 'alertAnimado alert alert-aviso alert-dismissible fade show';
      setTimeout(() => {
        this.classes = 'alertAnimado alert-primary hidden';
        this.textoAlerta = '';
      }, 4990);
    }
  }

  limpaTexto() {
    this.mostrar = false;
    this.textoAlerta = '';
  }
}
