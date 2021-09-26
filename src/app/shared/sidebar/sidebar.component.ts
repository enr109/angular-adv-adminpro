import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public usuarios?: Usuario;
  

  constructor( public sidebarService: SidebarService,
               private usuarioService: UsuarioService ) { 
    
    this.usuarios = usuarioService.usuario;
  }

  

  ngOnInit(): void {
  }

}
