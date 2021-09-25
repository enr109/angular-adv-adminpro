import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from 'src/app/services/hospital.service';
import Swal from 'sweetalert2';
import { Hospital } from '../../../models/hospital.model';

import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalTemp: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs?: Subscription;

  constructor( private hospitalService: HospitalService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(100))
    .subscribe(img => this.cargarHospitales());
  }


  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales()
        .subscribe( hospitales => {
          this.cargando = false;
          this.hospitales = hospitales;
        })
  }

  guardarCambios( hospital: Hospital){
    this.hospitalService.actualizarHospital( hospital._id, hospital.nombre).subscribe( resp => {
      Swal.fire('Actualizando', hospital.nombre, 'success');
    })
  }

  eliminarHospital( hospital: Hospital){
    this.hospitalService.borrarHospital( hospital._id )
    .subscribe( resp => {
      this.cargarHospitales();
      Swal.fire('Borrar', hospital.nombre, 'success');
    })
  }

  async abrirSweetAlert(){
    const { value } =  await Swal.fire({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    }) 

    if ( value?.trim().length > 0) {
      this.hospitalService.crearHospital( value )
      .subscribe( (resp: any) => {
        this.hospitales.push( resp.hospital)
      })
      
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }

  buscar( termino: string):any{

    if ( termino.length === 0) {
      return this.cargarHospitales();
      
    }
    this.busquedasService.buscar('hospitales', termino )
        .subscribe( (resp: any) => {
          this.hospitales = resp;
        });
  }

 

}
