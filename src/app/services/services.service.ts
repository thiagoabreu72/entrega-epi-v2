import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { user } from '@seniorsistemas/senior-platform-data';
import { Colaborador } from '../interfaces/colaborador.interface';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private urlSenior: string; //= environment.urlG5Hom;
  private portasG5 = [
    'GetMotivos',
    'PrevIndividual',
    'ProtocolaEntrega',
    'GerarRM',
    'GetColaborador',
    'GetEPI',
    'GetEPIdaRM',
    'GetFoto',
  ];
  private contexto: string; //= 'SXI-API';
  private modulo: string = 'sm';
  private urlGerarRM: string;
  private urlColaborador: string;
  private urlEPI: string;
  private urlFoto: string;
  private token = null;
  private tokenColaborador = null;
  //
  private idPlugin: string;
  private urlInvoke: string =
    'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/conector/actions/invoke';

  usuario: string = '';

  private capturaAcao = new Subject<string>(); // Criação do canal de comunicação.
  acao$ = this.capturaAcao.asObservable(); // instanciando o Observable para mudanças no valor

  constructor(private http: HttpClient) {
    const elemento = document.querySelector('app-root');
    this.idPlugin = elemento.getAttribute('idPlugin');
    this.urlSenior = elemento.getAttribute('urlG5');
    this.urlSenior =
      this.urlSenior + 'g5-senior-services/sm_SyncDistrib_EPI_G7?wsdl';

    this.contexto = elemento.getAttribute('contextoSXI');

    //Inicializa o token da propriedade corrente.
    this.urlColaborador = this.converteUrl(this.urlSenior, this.portasG5[4]);
    this.urlFoto = this.converteUrl(this.urlSenior, this.portasG5[7]);
    this.urlEPI = this.converteUrl(this.urlSenior, this.portasG5[5]);
    this.urlGerarRM = this.converteUrl(this.urlSenior, this.portasG5[3]);

    user
      .getToken()
      .then((retorno) => {
        this.token = retorno;
        const user = this.token.username.split('@');
        this.usuario = user[0];
        this.capturaAcao.next(this.token.access_token);
      })
      .catch((error) => {
        alert(
          'Não foi possível obter token. Verifique se a tela está sendo acessada pela plataforma Senior X.'
        );
      });
  }

  // Obtem o usuário da Senior
  getUser(): Observable<any> {
    if (this.token) {
      return of(this.token);
    } else {
      throw new Error('Erro ao obter o token do usuário logado.');
    }
  }

  // converte a url de Soap/WSDL para REST
  converteUrl(url, porta) {
    let novaUrl = url.split('/');
    let servico = novaUrl[4]
      .replace(`${this.modulo}_Sync`, '')
      .replace(`?wsdl`, '');
    novaUrl = `${novaUrl[0]}//${novaUrl[2]}/${this.contexto}/G5Rest?server=${novaUrl[0]}//${novaUrl[2]}&module=${this.modulo}&service=${servico}&port=${porta}`;
    return novaUrl;
  }

  // Buscar Informações do Colaborador
  buscaColaborador(tipo: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `bearer ${this.token.access_token}`,
    });

    let body = { perfil: this.usuario, tipoColaborador: tipo };
    body = this.montarBody('GetColaborador', body);
    // return this.http.post<any>(this.urlColaborador, body, { headers });
    return this.http.post<any>(this.urlInvoke, body, { headers });
  }

  // Busca foto do colaborador
  buscaFoto(dados: Colaborador): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `bearer ${this.token.access_token}`,
    });
    let body = dados;
    body = this.montarBody('GetFoto', body);
    // return this.http.post<any>(this.urlFoto, dados, { headers });
    return this.http.post<any>(this.urlInvoke, body, { headers });
  }

  // Busca os EPIs do Colaborador
  buscaEpis(dados: Colaborador): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `bearer ${this.token.access_token}`,
    });

    let body = this.montarBody('GetEPI', dados);
    return this.http.post<any>(this.urlInvoke, body, { headers });
    // return this.http.post<any>(this.urlEPI, dados, { headers });
  }

  gerarRM(dados: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `bearer ${this.token.access_token}`,
    });
    let body = this.montarBody('GerarRM', dados);
    return this.http.post<any>(this.urlInvoke, body, { headers });
    // return this.http.post<any>(this.urlGerarRM, dados, { headers });
  }

  montarBody(port: string, inputData: any): any {
    return {
      inputData: {
        module: this.modulo,
        encryption: '0',
        server: this.urlSenior,
        service: 'Distrib_EPI_G7',
        rootObject: '',
        user: '',
        password: '',
        port,
        ...inputData, // Adiciona os parâmetros dinâmicos
      },
      id: this.idPlugin,
    };
  }
}
