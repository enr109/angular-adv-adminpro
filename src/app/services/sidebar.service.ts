import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Dashboard!!!',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/'},
        { titulo: 'Gráficas', url: 'graficas1'},
        { titulo: 'rxjs', url: 'rxjs'},
        { titulo: 'Promesa', url: 'promesa'},
        { titulo: 'ProgressBar', url: 'progress'},
      ]
    },
  ];

  constructor() { }
}
