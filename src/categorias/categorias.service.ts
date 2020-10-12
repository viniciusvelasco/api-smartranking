import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualiza-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService) {}

    async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
        const { categoria } = criarCategoriaDto;

        const categoriaEncontada = await this.categoriaModel.findOne({categoria}).exec();

        if(categoriaEncontada) {
            throw new BadRequestException(`Categoria ${categoria} já cadastrada!`)
        }

        const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
        return await categoriaCriada.save();
    }

    async consultarTodasCategorias(): Promise<Array<Categoria>> {
        return await this.categoriaModel.find().populate('jogadores').exec();
    }

    async consultarCategoriaPeloId(categoria: string): Promise<Categoria> {
        const categoriaEncontada = await this.categoriaModel.findOne({categoria}).exec();

        if(!categoriaEncontada) {
            throw new NotFoundException(`Categoria ${categoria} não encontrada`);
        }

        return categoriaEncontada;
    }

    async atualizarCategoria(categoria: string, atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
        const categoriaEncontada = await this.categoriaModel.findOne({categoria}).exec();

        if(!categoriaEncontada) {
            throw new BadRequestException(`Categoria ${categoria} não encontrada!`);
        }

        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: atualizarCategoriaDto}).exec();
    }

    async atribuirCategoriaJogador(params: string[]): Promise<void> {
        const categoria = params['categoria'];
        const idJogador = params['idJogador'];

        const categoriaEncontada = await this.categoriaModel.findOne({categoria}).exec();

        await this.jogadoresService.consultarJogadorPeloId(idJogador);
        const jogadorJaCadastradoCategoria = await this.categoriaModel.find({categoria}).where('jogadores').in(idJogador).exec();

        if(!categoriaEncontada) {
            throw new BadRequestException(`Categoria ${categoria} não cadastrada!`);
        }

        
        if(jogadorJaCadastradoCategoria.length > 0) {
            throw new BadRequestException(`Jogador ${idJogador} ja cadastrado na categoria ${categoria}`);
        }

        categoriaEncontada.jogadores.push(idJogador);

        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: categoriaEncontada}).exec();
    }

}