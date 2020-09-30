import { Document } from 'mongoose';
export interface Jogador extends Document {
    readonly telefoneCelular: string;
    readonly email: string;
    nome: string;
    raking: string;
    posicaoRanking: number;
    urlFotoJogador: string;
}