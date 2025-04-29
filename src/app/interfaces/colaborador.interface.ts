export interface Foto {
  endArq: string;
  fotBlo: string;
  temFoto: number;
}

export interface Colaborador {
  numEmp: number;
  tipCol: number;
  numCad: number;
  nomFun?: string;
  posTra?: string;
  desPos?: string;
  estCar?: string;
  codCar?: string;
  titRed?: string;
  sitCol?: number;
  desSit?: string;
  datAdm?: Date;
  datDem?: Date;
  codEsc?: number;
  nomEsc?: string;
  numFis?: number;
  foto?: Foto;
  perfil?: string;
}
