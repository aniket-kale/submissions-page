import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../shared/constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { Submission } from './shared/submissions.interface';

@Injectable({
  providedIn: 'root'
})
export class SubmissionsService {

  // Defining event listener to catch base map layer change event
  baseMapSwitcher$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private httpClient: HttpClient) { }

  /**
   * Used to fetch the submissions data
   * @returns <Array<Submission>
   */
  getSubmissions(): Observable<Array<Submission>> {
    return this.httpClient.get<Array<Submission>>(Constants.apiUrl);
  }

  /**
   * Used to build layer button and it's functionality
   * @returns HTMLElement
   */
  getLayerContainer(): HTMLElement {
    const button = document.createElement('button');
    button.className =
      'rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 block';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    `;

    const layerSwitcher = document.createElement('div');
    layerSwitcher.className = 'px-2.5 bg-white py-0.5 rounded-md hidden';

    const spaceDiv = document.createElement('space-y-4');
    // Radio buttons
    const radioButtons = [
      {
        id: 'satelight',
        label: 'Satelight',
        value: 'mapbox://styles/mapbox/satellite-v9',
      },
      {
        id: 'light',
        label: 'Light',
        value: 'mapbox://styles/mapbox/light-v10',
      },
    ];

    // Creating actual radio buttons to change the style
    radioButtons.forEach(style => {
      const flexDiv = document.createElement('div');
      flexDiv.className = 'flex items-center';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'selected-layer';
      input.value = style.label;
      input.id = style.id;
      input.checked = style.id === 'light';
      input.className = 'cursor-pointer';

      flexDiv.appendChild(input);

      const label = document.createElement('label');
      label.setAttribute('for', style.id);
      label.className = 'block ml-3 text-sm font-medium leading-6 text-gray-900 cursor-pointer';
      label.innerHTML = style.label;

      flexDiv.appendChild(label);

      // adding event listener to catch event as soon as changes the radio button selection
      input.addEventListener('click', (event: Event) => {
        let selectedStyle = radioButtons[0].value;
        const currentTarget: any = event.target;
        if (currentTarget?.value === radioButtons[1].label) {
          selectedStyle = radioButtons[1].value;
        }

        // triggering an event to change basemap to selected basemap style
        this.baseMapSwitcher$.next(selectedStyle);
      });

      spaceDiv.appendChild(flexDiv);
    });

    layerSwitcher.appendChild(spaceDiv);

    // on mouse over event to show layer toggler
    button.addEventListener('mouseenter', () => {
      const from = 'block';
      const to = 'hidden';
      button.classList.replace(from, to);
      layerSwitcher.classList.replace(to, from);
    });

    // on mouse leave event to show layer button
    layerSwitcher.addEventListener('mouseleave', () => {
      const from = 'hidden';
      const to = 'block';
      button.classList.replace(from, to);
      layerSwitcher.classList.replace(to, from);
    });

    const div = document.createElement('div');
    div.appendChild(button);
    div.appendChild(layerSwitcher);

    // returning whole HTMLElement with layer toggle button and layer toggler
    return div;
  }

}
