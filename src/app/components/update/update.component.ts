import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  createEmpleado: FormGroup;
  loading: boolean = false;
  submitted = false;
  id: string | null;
  titulo = 'Agregar Empleado';
  constructor(private fb: FormBuilder,
    private _empleadoService: EmpleadoService,
    private toastr: ToastrService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private aRoute: ActivatedRoute) {
    this.createEmpleado = this.fb.group({
      instancia: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id)
  }

  ngOnInit(): void {
    this.esUsuario();
  }
  agregarEditarUsuarios() {
    this.loading = true;
    this.submitted = true;

    if (this.createEmpleado.invalid) {
      return;
    }
    if (this.id === null) {
      this.agregarUsuario
    } else {
      this.editarUsuario(this.id);
    }

  }
  editarUsuario(id: string) {

    const usuario: any = {
      instancia: this.createEmpleado.value.instancia,
      usuario: this.createEmpleado.value.usuario,
      clave: this.createEmpleado.value.clave,
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._empleadoService.actualizarUsuario(id, usuario).then(() => {
      this.loading = false;
      this.toastr.info('El empleado fue modificado con exito', 'Empleado Modificado')
    })
    this.router.navigate(['/list']);
  }

  agregarUsuario() {
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
  esUsuario() {
    this.titulo = 'editar usuario';
    if (this.id !== null) {
      this.loading = true;
      this._empleadoService.getUsuario(this.id).subscribe(data => {
        this.loading = false
        console.log(data.payload.data()['instancia']);
        this.createEmpleado.setValue({
          instancia: data.payload.data()['instancia'],
          usuario: data.payload.data()['usuario'],
          clave: data.payload.data()['clave'],
        })
      })
    }
  }
  logOut() {
    this.afAuth.signOut().then(() => this.router.navigate(['/login']));
  }
}


