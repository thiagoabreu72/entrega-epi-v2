export interface Epi {
  codEpi: number;
  desEpi: string;
  qtdDis: number;
  medEpi: string;
  altMed: string;
  altQtd: string;
  qtdAbe: number;
  devObr: string;
  gruEqu: number;
  abeGru: number;
  qtdTot: number;
  ultEnt?: string;
  diaVal?: number;
}

export interface Relatorio {
  relEst?: string;
}
