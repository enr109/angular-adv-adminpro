import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medicos.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[]=[];
  public hospitalSeleccionado?: Hospital;
  public medicoSeleccionado?: Medico;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoservice: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params
    .subscribe( ({ id }) => this.cargarMedico(id));
    

    this.medicoForm = this.fb.group({
      nombre: [ '', Validators.required ],
      hospital: ['', Validators.required],
    });
    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges
        .subscribe( hospitalId => {
          this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId);
          
          
        })
  }

  cargarMedico(id: string){

    if ( id === 'nuevo') {
      return;
      
    }
    this.medicoservice.obtenerMedicoPOrId(id)
        .subscribe( medico => {
          const { nombre, hospital: { _id }} = medico;
          
          this.medicoSeleccionado = medico;
          console.log(this.medicoSeleccionado);
          /* this.medicoForm.setValue({nombre}) */
          this.medicoForm.setValue({nombre, hospital: _id});
        }, error => {
          return this.router.navigateByUrl(`/dashboard/medicos`);
        });
  }

  cargarHospitales(){
    
    this.hospitalService.cargarHospitales()
    .subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
      console.log(this.hospitales);
      
    })
  }

  guardarMedico(){
    console.log(this.medicoSeleccionado);
    if (this.medicoSeleccionado) {

      // actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoservice.actualizarMedico( data)
          .subscribe( resp => {
            console.log(resp)
            Swal.fire('Actualizado', `${ data.nombre } actualizado corectamente`, 'success');
          })
      
    } else {
      // crear 
      const { nombre } = this.medicoForm.value
      this.medicoservice.crearMedico( this.medicoForm.value)
          .subscribe( (resp: any) => {
            console.log(resp);
            Swal.fire('Creado', `${ nombre } creado corectamente`, 'success');
            this.router.navigateByUrl(`/dashboard/medico/${ resp.medicos._id }`)
          })
    }
  }

}
