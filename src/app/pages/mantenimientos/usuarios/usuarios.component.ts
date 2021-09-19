import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuario: Usuario[] = [];
  public usuarioTemp: Usuario[] = [];
  public imgSubs?: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
               private busquedasService: BusquedasService,
               private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs= this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => {
      console.log(img);
      this.cargarUsuarios()
    });
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuario( this.desde )
    .subscribe( ({ total, usuarios }) => {
      if ( usuarios.length !== 0) {
        this.totalUsuarios =  total;
        this.usuario = usuarios;
        this.usuarioTemp = usuarios;
        this.cargando = false;
        
      }
    })
  }


  cambiarPagina( valor: number ) {
    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalUsuarios ) {
      this.desde -= valor;
    }

    this.cargarUsuarios();

  }


  buscar( termino: string ):any{

    if ( termino.length === 0) {
      return this.usuario = [...this.usuarioTemp];
      
    }
    this.busquedasService.buscar('usuarios', termino )
        .subscribe( resultados => {
          this.usuario = resultados;
        });
  }

  eliminarUsuario( usuario: Usuario ):any {
    console.log(this.usuarioService.uid);
    if ( usuario.uid === this.usuarioService.uid ) {
      return Swal.fire('Error', 'No puedes borrarse a si mismo', 'error');
      
    }
    

    Swal.fire({
      title: '¿ Borrar usuario ?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario)
          .subscribe( resp => {
            this.cargarUsuarios();
            Swal.fire(
              'Usuario borrado',
              `${ usuario.nombre } fue eliminado correctamente`,
              'success'
            );

          });
      }
    })
  }

  cambiarRole( usuario:Usuario){
    this.usuarioService.guardarUsuario( usuario)
      .subscribe( resp => {
        console.log(resp);
      })
  }

  abrirModal( usuario: Usuario ){
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
