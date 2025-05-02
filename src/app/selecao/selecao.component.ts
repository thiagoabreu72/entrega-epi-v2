import { Colaborador } from '../interfaces/colaborador.interface';
import { Component, EventEmitter, Output } from '@angular/core';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-selecao',
  templateUrl: './selecao.component.html',
  styleUrls: ['./selecao.component.scss'],
})
export class SelecaoComponent {
  //@Output() valorTipo = new EventEmitter<number>();
  @Output() dadosColaborador = new EventEmitter<any>();
  @Output() dadosFoto = new EventEmitter<string>();
  @Output() dadosEpi = new EventEmitter<any>();
  @Output() carregando = new EventEmitter<boolean>();
  @Output() textoAlerta = new EventEmitter<string>();
  @Output() tipoAlerta = new EventEmitter<number>();

  private tipCol: number;
  private numEmp: number;
  colaboradores: Colaborador[];

  //carregandoDados: boolean = false;

  constructor(private service: ServicesService) {
    // this.tipCol = 1;
    // this.buscaColaborador(1);
    service.acao$.subscribe(
      (retorno) => {
        if (retorno) {
          this.tipCol = 1;
          this.buscaColaborador(1);
        } else this.enviaAlerta('Não foi possível obter Token.', 2); //alert('Não foi possível obter Token.');
      },
      (erro) => {
        console.log(erro);
        window.scrollTo(0, 0);
        this.enviaAlerta(erro, 2);
      }
    );
  }

  enviaAlerta(texto: string, tipo: number) {
    this.textoAlerta.emit(texto);
    this.tipoAlerta.emit(tipo);
  }

  capturaValorTipo(evento: any) {
    let tipCol = evento.substring(0, 1);
    this.tipCol = tipCol;
    this.buscaColaborador(tipCol);
  }

  buscaColaborador(dados: number) {
    this.carregando.emit(true);
    this.service.buscaColaborador(dados).subscribe(
      (retorno) => {
        let colaboradores = retorno.outputData.colaboradores;

        if (colaboradores === undefined) {
          this.carregando.emit(false);
          window.scrollTo(0, 0);
          this.enviaAlerta(retorno.outputData.msgErro, 2);
          //alert(retorno.msgErro);
        } else {
          this.colaboradores = retorno.outputData.colaboradores;
          this.numEmp = colaboradores[0].numEmp;
          this.carregando.emit(false);
        }
      },
      (erro) => {
        //console.log(erro);
        //alert(erro.errorMessage);
        this.carregando.emit(false);
        window.scrollTo(0, 0);
        this.enviaAlerta(erro.errorMessage, 2);
      }
    );
  }

  // Busca Foto e EPIs do Colaborador
  buscaDados(dados: string) {
    this.carregando.emit(true);
    /*this.service.getUser().subscribe((retorno) => {
      this.usuario = retorno.username.split('@');
    });*/

    let obtemNumero: any = dados.split(' - ');
    obtemNumero = obtemNumero[0].trim();
    let dadosColaborador = {
      perfil: this.service.usuario,
      numEmp: this.numEmp,
      tipCol: this.tipCol,
      numCad: obtemNumero,
    };

    this.dadosColaborador.emit(dadosColaborador);
    this.service.buscaFoto(dadosColaborador).subscribe(
      (retorno) => {
        if (
          retorno.outputData.temFoto == 1 &&
          retorno.outputData.fotBlo !== undefined
        ) {
          this.dadosFoto.emit(
            `data:image/png;base64,${retorno.outputData.fotBlo}`
          );
          this.buscaEpis(dadosColaborador);
        } else {
          this.dadosFoto.emit('./assets/avatar.jpeg');
          this.buscaEpis(dadosColaborador);
        }
      },
      (erro) => {
        this.carregando.emit(false);
        window.scrollTo(0, 0);
        this.enviaAlerta(erro.errorMessage, 2);
        //alert(erro);
      }
    );
  }

  buscaEpis(dadosColaborador: any) {
    this.service.buscaEpis(dadosColaborador).subscribe(
      (retorno) => {
        console.log(retorno.outputData.EPI);
        if (
          retorno.outputData.msgRet == 'ok' &&
          retorno.outputData.EPI == undefined
        ) {
          let criaArray = [];

          this.dadosEpi.emit(criaArray);
          this.enviaAlerta('Não possui EPI pendente para entrega.', 3);
          //alert('Não houve informações a listar.');
        } else if (retorno.outputData.EPI.length === undefined) {
          let criaArray = [];
          criaArray.push(retorno.outputData.EPI);
          this.dadosEpi.emit(criaArray);
          this.enviaAlerta('Nada a fazer', 4);
          retorno.outputData.msgRet == 'ok';
        } else if (retorno.outputData.msgRet == 'ok') {
          this.dadosEpi.emit(retorno.outputData.EPI);
          this.enviaAlerta('Nada a fazer', 4);
        } else {
          window.scrollTo(0, 0);
          this.enviaAlerta(retorno.outputData.msgRet, 1);
          //alert(retorno.msgRet);
        }
        this.carregando.emit(false);
      },
      (erro) => {
        //alert(erro);
        this.carregando.emit(false);
        window.scrollTo(0, 0);
        this.enviaAlerta(erro.errorMessage, 2);
      }
    );
  }
}
