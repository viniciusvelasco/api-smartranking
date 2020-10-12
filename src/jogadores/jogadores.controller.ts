import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtualizarJogadorDto } from './dtos/atualizar-jagador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresValiadacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(private readonly jogadoresService: JogadoresService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(@Body() criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await this.jogadoresService.criarJogador(criarJogadorDto);         
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(@Body() atualizarJogadorDto: AtualizarJogadorDto, @Param('_id', JogadoresValiadacaoParametrosPipe) _id: string): Promise<void> {
        await this.jogadoresService.atualizarJogador(_id, atualizarJogadorDto);         
    }

    @Get()
    async consultarJogadores(): Promise<Jogador[]> {
        return await this.jogadoresService.consultarTodosJogadores();
    }

    @Get('/:_id')
    async consultarJogadorPeloId(@Param('_id', JogadoresValiadacaoParametrosPipe) _id: string): Promise<Jogador> {
        return await this.jogadoresService.consultarJogadorPeloId(_id);
    }

    @Delete('/:_id')
    async deletarJogador(@Param('_id', JogadoresValiadacaoParametrosPipe)_id: string): Promise<void> {
        await this.jogadoresService.deletarJogador(_id);
    }
}
