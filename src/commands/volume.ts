//discord volume command

import {ChatInputCommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types.js';
import PlayerManager from '../managers/player.js';
import Command from '.';
import {buildQueueEmbed} from '../utils/build-embed.js';

@injectable()
export default class implements Command {
    public readonly slashCommand = new SlashCommandBuilder()
        .setName('volume')
        .setDescription('change the volume of the player')
        .addIntegerOption(option => option
        .setName('volume')
        .setDescription('volume to set [default: 100]')
        .setRequired(false));
    
    private readonly playerManager: PlayerManager;
    
    constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
        this.playerManager = playerManager;
    }
    
    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const player = this.playerManager.get(interaction.guild!.id);
        console.log(player.volume(5));
        console.log('ho');
        return;
        const volume = interaction.options.getInteger('volume') ?? 100;
    
        player.volume(volume);
    
        await interaction.reply(`Volume set to ${volume}`);
    }
}
