import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  loading: boolean = false;
  submitted = false;
  id: string | null;
  titulo = 'Agregar Empleado'
  
  constructor(private fb: FormBuilder,
    private _empleadoService: EmpleadoService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private afAuth: AngularFireAuth) {
    this.createEmpleado = this.fb.group({
      instancia: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id)
  }

  ngOnInit(): void {
    this.editarUsuario;
  }
  agregarUsuarios() {
    this.loading = true;
    this.submitted = true;

    if (this.createEmpleado.invalid) {
      return;
    }
    const usuario: any = {
      instancia: this.createEmpleado.value.instancia,
      usuario: this.createEmpleado.value.usuario,
      clave: this.createEmpleado.value.clave,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this._empleadoService.agregarUsuario(usuario).then(() => {
      console.log('empleado registrado con exitos');
      this.toastr.success('Usuario Registrado con exitos', 'exitoso');
      this.router.navigate(['/list']);
    }).catch(error => {
      this.loading = false;
      console.log(error);
    })
  }

  editarUsuario() {
    if (this.id !== null) {
      this._empleadoService.getUsuario(this.id).subscribe(data => {
        console.log(data)
      })
    }
  }
  logOut() {
    this.afAuth.signOut().then(() => this.router.navigate(['/login']));
  }
}

