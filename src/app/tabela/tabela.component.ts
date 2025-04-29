import { RM } from './../interfaces/rm.interface';
import { Colaborador } from './../interfaces/colaborador.interface';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Epi, Relatorio } from '../interfaces/epi.interface';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss'],
})
export class TabelaComponent implements OnChanges {
  @Input() dadosColaborador: Colaborador;
  @Input() dadosEpi: Epi[] = [];
  @Output() carregando = new EventEmitter<boolean>();
  @Output() tipoAlerta = new EventEmitter<number>();
  @Output() textoAlerta = new EventEmitter<string>();
  @Output() habilitarProtocolo = new EventEmitter<boolean>();
  @Output() codigoRM = new EventEmitter<string>();

  //@Output() dadosRM: RM; //new EventEmitter<any>();
  dadosRM: RM; //new EventEmitter<any>();
  tabela: FormGroup;
  dadosRelatorio: Relatorio;
  desabilitarGerarRM: boolean = true;
  desabilitarProtocolo: boolean = true;
  desabilitarNova: boolean = true;

  constructor(
    private formBuild: FormBuilder,
    private service: ServicesService
  ) {
    this.tabela = new FormGroup({
      valores: new FormGroup({
        selecionado: this.geraControle(),
        codEpi: this.geraControle(),
        qtdSol: this.geraControle(),
        qtdDev: this.geraControle(),
        qtdDan: this.geraControle(),
        medEpi: this.geraControle(),
        diaVal: this.geraControle(),
        ultEnt: this.geraControle(),
        devObr: this.geraControle(),
      }),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dadosEpi) {
      if (changes.dadosEpi.currentValue !== changes.dadosEpi.previousValue) {
        this.tabela = new FormGroup({
          valores: new FormGroup({
            selecionado: this.geraControle(),
            codEpi: this.geraControle(),
            qtdSol: this.geraControle(),
            qtdDev: this.geraControle(),
            qtdDan: this.geraControle(),
            medEpi: this.geraControle(),
            diaVal: this.geraControle(),
            ultEnt: this.geraControle(),
            devObr: this.geraControle(),
          }),
        });
        this.desabilitaBotao(true);
      }
    }
  }

  enviaAlerta(texto: string, tipo: number) {
    this.textoAlerta.emit(texto);
    this.tipoAlerta.emit(tipo);
  }

  // Para cada posição selecionada, cria um formControl
  geraControle() {
    let dados: any[] = this.dadosEpi;

    dados = dados.map((valor) => {
      new FormControl(false);
    });
    return this.formBuild.array(dados);
  }

  // Obtem os dados cadastrados na tabela conforme seleção para geração da RM
  async capturaEpis() {
    this.carregando.emit(true);
    let entrouErro = 0;
    let dados = Object.assign({}, this.tabela.value.valores);
    dados = Object.assign(dados, {
      epi: dados.selecionado
        .map((v, i) =>
          v
            ? {
                EPI: {
                  codEpi: this.dadosEpi[i].codEpi,
                  qtdSol:
                    this.tabela.value.valores.qtdSol[i] == null
                      ? this.dadosEpi[i].qtdTot
                      : this.tabela.value.valores.qtdSol[i],
                  medEpi:
                    this.tabela.value.valores.medEpi[i] == null
                      ? this.dadosEpi[i].medEpi
                      : this.tabela.value.valores.medEpi[i],
                  qtdDev:
                    this.tabela.value.valores.qtdDev[i] == null
                      ? 0
                      : this.tabela.value.valores.qtdDev[i],
                  qtdDan:
                    this.tabela.value.valores.qtdDan[i] == null
                      ? 0
                      : this.tabela.value.valores.qtdDan[i],
                  devObr: this.dadosEpi[i].devObr,
                  ultEnt: this.dadosEpi[i].ultEnt,
                },
              }
            : null
        )

        .filter((v) => v !== null),
    });

    let dadosRM: RM = {
      perfil: this.dadosColaborador.perfil,
      numEmp: this.dadosColaborador.numEmp,
      tipCol: this.dadosColaborador.tipCol,
      numCad: this.dadosColaborador.numCad,
      EPI: [],
    };

    for (let i = 0; i < dados.epi.length; i++) {
      if (
        dados.epi[i].EPI.qtdDan == 0 &&
        dados.epi[i].EPI.qtdDev == 0 &&
        dados.epi[i].EPI.devObr == 'Sim' &&
        dados.epi[i].EPI.ultEnt !== undefined
      ) {
        entrouErro++;
        break;
      }

      dadosRM.EPI.push(dados.epi[i].EPI);
    }

    if (entrouErro == 0) this.gerarRM(dadosRM);
    else {
      alert(
        'EPI com devolução obrigatória. Para nova retirada antes do vencimento, é necessário informar quantidade  de devolução ou danificado.'
      );
      this.carregando.emit(false);
    }
  }

  // Gerar RM
  gerarRM(dados: any) {
    this.desabilitaBotao(false);

    this.service.gerarRM(dados).subscribe(
      (retorno) => {
        //console.log(retorno);
        if (retorno.outputData.msgErro == 'ok') {
          this.carregando.emit(false);
          // this.dadosEpi = [];
          this.dadosRelatorio = retorno.outputData.relEst;
          window.scrollTo(0, 0);
          this.codigoRM.emit(retorno.outputData.RM); //
          this.enviaAlerta(`Requisição: ${retorno.outputData.RM}`, 1);
          this.desabilitarProtocolo = false;
          this.desabilitarNova = false;
        } else {
          this.carregando.emit(false);
          window.scrollTo(0, 0);
          this.enviaAlerta(retorno.outputData.msgErro, 2);
          this.desabilitaBotao(true);
          //alert(retorno.msgErro);
        }
      },
      (erro) => {
        this.carregando.emit(false);
        window.scrollTo(0, 0);
        this.enviaAlerta(erro.error.errorMessage, 2);
        this.desabilitaBotao(true);
        //alert(erro.error.errorMessage);
      }
    );
  }

  desabilitaBotao(valor: boolean) {
    if (valor == true) this.desabilitarGerarRM = false;
    else this.desabilitarGerarRM = true;

    // return this.desabilitarGerarRM;
  }

  imprimirRM() {
    // Versão Braspine
    /*let link: string =
      'https://platform.senior.com.br/senior-x/#/Gest%C3%A3o%20de%20Pessoas%20%7C%20HCM/0/bdbd68d5-ddbb-47c3-a86c-7677b82ed725?category=frame&link=https:%2F%2F200.195.169.187:8084%2Fprotocolo-epi%2F&withCredentials=true&r=3';*/

    // Versão Sooro
    let link: string =
      'https://hcm.senior.com.br/integration.html?url=' + this.dadosRelatorio;
    //console.log(link);
    //window.open(link, '_blank');
  }

  limparCampos() {
    this.dadosEpi = [];
    this.desabilitarGerarRM = true;
    this.desabilitarNova = true;
    this.desabilitarProtocolo = true;
    this.habilitarProtocolo.emit(false);
    window.location.reload();
  }
}
