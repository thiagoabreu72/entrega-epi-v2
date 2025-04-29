import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Epi } from '../interfaces/epi.interface';
import { RM2, RMBotoes } from '../interfaces/rm.interface';
import { ServicesService } from '../services/services.service';
import { ApiFacial } from '../interfaces/api-facial';

@Component({
  selector: 'app-tela-protocolo',
  templateUrl: './tela-protocolo.component.html',
  styleUrls: ['./tela-protocolo.component.scss'],
})
export class TelaProtocoloComponent implements OnInit {
  @Input() codigoRM: string = '';
  @Input() dadosRM: RM2;
  @Input() fotoColaborador: ApiFacial;
  @Input() dadosRelatorio: any;
  @Input() dadosEpi: Epi[] = [];
  @Input() dadosBotoes: RMBotoes = {};
  @Output() exibirTexto = new EventEmitter<boolean>();
  @Output() carregando = new EventEmitter<boolean>();
  @Output() tipoAlerta = new EventEmitter<number>();
  @Output() textoAlerta = new EventEmitter<string>();
  @Output() limpar = new EventEmitter<boolean>();

  tabela: FormGroup;
  modal: FormGroup;
  // Desabilita botoes
  desabilita: boolean = true;
  desSenha: boolean = true;
  desBiometria: boolean = true;
  desAssinatura: boolean = true;
  desCracha: boolean = true;
  desFacial: boolean = true;
  ligaCamera: boolean = false;
  botaoClicado: string = '';
  confirmacaoIdentidade: boolean = false;

  constructor(
    private formBuild: FormBuilder,
    private service: ServicesService
  ) {
    this.tabela = new FormGroup({
      valores: this.geraControle(),
    });
    this.modal = new FormGroup({
      pass: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.carregando.emit(true);
    this.service.buscaDadosRM(this.codigoRM).subscribe(
      (retorno) => {
        // this.codigoRM = '00076';
        if (
          retorno.outputData.msgErro === 'ok' &&
          retorno.outputData.numCad === 0
        ) {
          this.carregando.emit(false);
          this.enviaAlerta('RM não encontrada.', 2);
        } else {
          // Encaminha os dados para os campos
          this.dadosRM = retorno.outputData;
          this.dadosRM.RM = this.codigoRM.toString();
          const dados = {
            numEmp: retorno.outputData.numEmp,
            tipCol: retorno.outputData.tipCol,
            numCad: retorno.outputData.numCad,
            perfil: this.service.usuario,
          };

          if (Array.isArray(retorno.outputData.EPI))
            this.dadosEpi = retorno.outputData.EPI;
          else {
            let dados: Epi[] = [];
            dados.push(retorno.outputData.EPI);
            this.dadosEpi = dados;
          }
          this.carregando.emit(false);
        }
      },
      (erro) => {
        //alert(erro);
        this.enviaAlerta(erro.error.errorMessage, 2);
        this.carregando.emit(false);
      }
    );
  }

  enviaAlerta(texto: string, tipo: number) {
    this.textoAlerta.emit(texto);
    this.tipoAlerta.emit(tipo);
  }

  geraControle(): FormArray {
    return this.formBuild.array(this.dadosEpi.map(() => new FormControl(null)));
  }

  //obtem o resultado vindo do componente webcam
  obterConfirmacao(valor: boolean) {
    if (valor) this.protocolaRM();
  }

  // Obtem os valores referente ao clique e limpa o campo senha
  obtemValorBotao(valor: string) {
    document.addEventListener('DOMContentLoaded', function () {
      const modal = document.getElementById('modalSenha');
      const passwordInput = document.getElementById('password');

      if (modal && passwordInput) {
        modal.addEventListener('shown.bs.modal', function () {
          passwordInput.focus();
        });
      }
    });
    this.enviaAlerta('NOVA', 0);
    this.modal.setValue({ pass: '' });
    this.botaoClicado = valor;
    // if (this.botaoClicado === 'F') {
    //   this.ligaCamera = true;
    // }
    if (this.botaoClicado === 'M' || this.botaoClicado === 'FACE')
      this.protocolaRM();
  }

  // Monta os dados para protocolar a RM
  protocolaRM() {
    this.carregando.emit(true);
    this.exibirTexto.emit(true);

    // Monta as informações que serão utilizadas na protocolação
    let dadosRM: RM2 = {
      perfil: this.service.usuario,
      RM: this.codigoRM,
      numEmp: this.dadosRM.numEmp,
      tipCol: this.dadosRM.tipCol,
      numCad: this.dadosRM.numCad,
      EPI: this.dadosEpi,
      tipoProtocolo: this.botaoClicado,
      senhaProtocolo: this.modal.value.pass,
    };

    //this.dadosRM.emit(dadosRM);
    this.service.protocolaEntrega(dadosRM).subscribe(
      (retorno) => {
        console.log(retorno.outputData.msgErro);
        window.scrollTo(0, 0);
        if (retorno.outputData.msgErro == 'Ok') {
          this.enviaAlerta(retorno.outputData.msgSucesso, 1);
          this.limparCampos();
        } else this.enviaAlerta(retorno.outputData.msgErro, 2);
        this.carregando.emit(false);
        this.exibirTexto.emit(false);
      },
      (erro) => {
        window.scrollTo(0, 0);
        this.enviaAlerta(erro.error.errorMessage, 2);
        this.carregando.emit(false);
        this.exibirTexto.emit(false);
      }
    );
  }

  limparCampos() {
    this.dadosEpi = [];
    this.limpar.emit(true);
  }
}
