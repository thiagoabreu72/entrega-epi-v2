export interface RM {
  perfil: string;
  numEmp: number;
  tipCol: number;
  numCad: number;
  EPI: object[];
  msgErro?: string;
  RM?: string;
}

export interface RM2 {
  perfil?: string;
  numEmp: number;
  tipCol: number;
  numCad: number;
  nomFun?: string;
  EPI?: object[];
  msgErro?: string;
  msgSucesso?: string;
  RM?: string;
  posBio?: string;
  tipoProtocolo?: string;
  senhaProtocolo?: string;
  relAss?: string;
}

export interface RMColaborador {
  numEmp: number;
  tipCol: number;
  numCad: number;
  RM: string;
}

export interface RMBotoes {
  utiSen?: string;
  utiCra?: string;
  utiBio?: string;
  utiAss?: string;
  utiFot?: string;
}
