// Discord volume command

import {ChatInputCommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types.js';
import PlayerManager from '../managers/player.js';
import Command from '.';

@injectable()
export default class implements Command {
  public readonly slashCommand = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('change the volume of the player')
    .addNumberOption(option => option
      .setName('volume')
      .setDescription('volume to set [default: 100%].')
      .setRequired(false));

  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const player = this.playerManager.get(interaction.guild!.id);
    if (!player) {
      await interaction.reply({content: 'No player found', ephemeral: true});
      return;
    }
    
    // Check if bot is in a voice channel
    if (!player.voiceConnection) {
      await interaction.reply({content: 'I am not in a voice channel', ephemeral: true});
      return;
    }

    let volumeOption = interaction.options.getNumber('volume', false);
    if (volumeOption) {
      volumeOption /= 100;
    }

    if (volumeOption !== null && (volumeOption < 0 || volumeOption > 1)) {
      await interaction.reply({content: 'Volume must be between 1 and 100%', ephemeral: true});
      return;
    }

    const response = player.volume(volumeOption);

    await interaction.reply(`Volume set to ${response.volume * 100}%`);
  }
}
