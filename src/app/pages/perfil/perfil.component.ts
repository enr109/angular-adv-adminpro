import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario?: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor( private fb: FormBuilder, 
               private usuarioService: UsuarioService,
               private fileUploadService: FileUploadService) { 
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [ this.usuario?.nombre , Validators.required ],
      email: [ this.usuario?.email , [Validators.required, Validators.email ] ],
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm?.value )
    .subscribe( resp => {
      const { nombre, email } = this.perfilForm.value;
      this.usuario!.nombre = nombre;
      this.usuario!.email = email;
      Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
    }, (err) => {
      Swal.fire('Error', err.error.msg, 'error');
      
    });
  }

  cambiarImagen( event: any | undefined) {
    this.imagenSubir = event.target.files[0];
    if (!this.imagenSubir) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenSubir);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){

    this.fileUploadService
    .actualizarFoto( this.imagenSubir, 'usuarios', this.usuario?.uid )
    .then( img => {
      this.usuario?.img;
      Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
    }).catch( err => {
      console.log(err);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    });
    
  }

}
