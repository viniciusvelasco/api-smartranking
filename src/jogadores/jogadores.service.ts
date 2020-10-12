import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class JogadoresService {
    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
        const {email} = criaJogadorDto;

        const jogadorEncontado = await this.jogadorModel.findOne({email}).exec();

        if(jogadorEncontado) {
            await this.atualizar(criaJogadorDto)
        } else {
            await this.criar(criaJogadorDto);
        }
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec();
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
        const jogadorEncontado = await this.jogadorModel.findOne({email}).exec();

        if(!jogadorEncontado) {
            throw new NotFoundException(`Email ${email} não encontrado`);
        }
        return jogadorEncontado;
    }

    async deletarJogador(email: string): Promise<any> {
        return await this.jogadorModel.deleteOne({email}).exec();
    }

    private async criar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
        
        const jogadorCriado = new this.jogadorModel(criaJogadorDto);
        return await jogadorCriado.save();
    }

    private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await this.jogadorModel.findOneAndUpdate({email: criarJogadorDto.email}, {$set: criarJogadorDto}).exec();
    }
}
