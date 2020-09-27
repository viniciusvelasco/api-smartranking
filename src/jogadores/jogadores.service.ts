import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import {v4 as uuidv4 } from 'uuid';
@Injectable()
export class JogadoresService {
    private jogadores: Jogador[] = [];

    private readonly logger = new Logger(JogadoresService.name);

    async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
        const {email} = criaJogadorDto;

        const jogadorEncontado = await this.jogadores.find(jogador=>jogador.email === email);

        if(jogadorEncontado) {
            await this.atualizar(jogadorEncontado, criaJogadorDto)
        } else {
            await this.criar(criaJogadorDto);
        }
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return this.jogadores;
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
        const jogadorEncontado = this.jogadores.find(jogadr => jogadr.email === email);

        if(!jogadorEncontado) {
            throw new NotFoundException(`Email ${email} não encontrado`);
        }
        return jogadorEncontado;
    }

    async deletarJogador(email: string) {
        const jogadorEncontado = this.jogadores.find(jogadr => jogadr.email === email);
        this.jogadores = this.jogadores.filter(jogador => jogador.email !== jogadorEncontado.email);
    }

    private criar(criaJogadorDto: CriarJogadorDto): void {
        const { nome, email, telefoneCelular } = criaJogadorDto;

        const jogador: Jogador = {
            _id: uuidv4(),
            nome,
            telefoneCelular,
            email,
            raking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: 'www.google.com.br/foto123.jpg'
        }
        this.logger.log(JSON.stringify(jogador));
        this.jogadores.push(jogador);
    }

    private atualizar(jogadorEncontado: Jogador, CriarJogadorDto: CriarJogadorDto): void {
        const {nome} = CriarJogadorDto;

        jogadorEncontado.nome = nome;
    }
}
