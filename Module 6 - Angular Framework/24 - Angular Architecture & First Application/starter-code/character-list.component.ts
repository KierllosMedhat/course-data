import { Component, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
// TODO: Import the Character and ApiResponse interfaces from character.model
// import { ApiResponse } from './character.model';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent {
  // TODO: Use the modern Angular resource() API to fetch characters from
  // the Rick and Morty API: https://rickandmortyapi.com/api/character
  //
  // Example:
  // characterResource = resource({
  //   loader: async () => {
  //     const response = await fetch('https://rickandmortyapi.com/api/character');
  //     if (!response.ok) throw new Error('API error');
  //     const data: ApiResponse = await response.json();
  //     return data;
  //   }
  // });
}
