import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent  implements OnInit{

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '' , [ Validators.required, Validators.email]],
    password: ['123456', [ Validators.required]],
    remember: [false]
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioServices: UsuarioService,
               private ngZone: NgZone ) { }
  ngOnInit(): void {
    this.renderButton();
  }

  

  login(){
    this.usuarioServices.login( this.loginForm.value )
    .subscribe( resp => {
      if ( this.loginForm.get('remember')?.value ) {
        localStorage.setItem('email', this.loginForm.get('email')?.value);
      } else {
        localStorage.removeItem('email');
      }

      // Navegar al Dashboard
      this.router.navigateByUrl('/');
    }, (err)=> {
      Swal.fire('Error', err.error.msg,'error');
    })
  }

  /* var id_token = googleUser.getAuthResponse().id_token; */
  

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp();
  }

  async startApp() {

    /* await this.usuarioServices.googleInit();
    this.auth2 = this.usuarioServices.auth2;
    
    this.attachSignin(document.getElementById('my-signin2')); */
    gapi.load('auth2',() =>{
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '103431350240-itb0fn38cprjkmk9imd25ce85q08g8ug.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        
      });
      this.attachSignin(document.getElementById('my-signin2'));
    });
  };

  attachSignin(element:any) {
    this.auth2.attachClickHandler(element, {},
        (googleUser:any) =>{
          const id_token = googleUser.getAuthResponse().id_token;
          /* console.log(id_token); */
          this.usuarioServices.loginGoogle( id_token )
            .subscribe( resp => {
              // Navegar al Dashboard

              this.ngZone.run( () => {
                this.router.navigateByUrl('/');

              })
            });

          

          // mover al dashboard
        }, (error:any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }


}
