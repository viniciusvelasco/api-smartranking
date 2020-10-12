import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jagador.dto';
@Injectable()
export class JogadoresService {
    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    async criarJogador(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const {email} = criaJogadorDto;

        const jogadorEncontado = await this.jogadorModel.findOne({email}).exec();

        if(jogadorEncontado) {
            throw new BadRequestException(`Jogador com e-mail ${email} já cadastrado`)
        }

        const jogadorCriado = new this.jogadorModel(criaJogadorDto);
        return await jogadorCriado.save();
    }

    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
        const jogadorEncontado = await this.jogadorModel.findOne({_id}).exec();

        if(!jogadorEncontado) {
            throw new NotFoundException(`Jogador com o id ${_id} não encontado`)
        }

        await this.jogadorModel.findOneAndUpdate({_id}, {$set: atualizarJogadorDto}).exec();

    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec();
    }

    async consultarJogadorPeloId(_id: string): Promise<Jogador> {
        const jogadorEncontado = await this.jogadorModel.findOne({_id}).exec();

        if(!jogadorEncontado) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
        }
        return jogadorEncontado;
    }

    async deletarJogador(_id: string): Promise<any> {
        const jogadorEncontado = await this.jogadorModel.findOne({_id}).exec();

        if(!jogadorEncontado) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
        }

        return await this.jogadorModel.deleteOne({_id}).exec();
    }

}
