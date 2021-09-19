import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, delay, map,tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';


const base_url = environment.base_url;


declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario?: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone) { 
                this.googleInit();
  }

  
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  get uid(): string {
    return this.usuario?.uid || '';
  }
  googleInit() {
      gapi.load('auth2',() => {
        this.auth2 = gapi.auth2.init({
          client_id: '103431350240-itb0fn38cprjkmk9imd25ce85q08g8ug.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
      });
  }

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then( () => {

      this.ngZone.run(() => {
        
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${ base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img, uid } = resp.usuarioDB;
        this.usuario = new Usuario(nombre,email,'', img , google, role, uid);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError( error => of(false) )
    )
  }



  crearUsuario( formData: RegisterForm ){
    return this.http.post(`${ base_url}/usuarios`, formData)
    .pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token)
      })
    );
  }

  actualizarPerfil( data: { email:string, nombre: string, role: string | undefined}){

    data = {
      ...data,
      role:this.usuario?.role
    };

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data,  this.headers);

  }

  login( formData: LoginForm ){
    return this.http.post(`${ base_url}/login`, formData)
    .pipe(
      tap((resp: any) =>{
        localStorage.setItem('token', resp.token)
      })
    );
  }

  loginGoogle( token: string ){
    return this.http.post(`${ base_url}/login/google`, {token})
    .pipe(
      tap((resp: any) =>{
        localStorage.setItem('token', resp.token)
      })
    );
  }

  cargarUsuario( desde: number = 0){

    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>(url, this.headers)
           .pipe(
             delay(1000),
             map( resp => {
               const usuarios = resp.usuario.map( user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid));
               return {
                 total: resp.total,
                 usuarios
               };
             })
           )

  }

  eliminarUsuario( usuario: Usuario){
    const url = `${ base_url }/usuarios/${ usuario.uid}`;
    return this.http.delete( url, this.headers);
  }

  guardarUsuario( usuario: Usuario ){

    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario,  this.headers);

  }
  
}
