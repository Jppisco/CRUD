import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-empleado',
  templateUrl: './list-empleado.component.html',
  styleUrls: ['./list-empleado.component.css']
})
export class ListEmpleadoComponent implements OnInit {
  empleados: any[] = [];
  loading: boolean = false;
  constructor(private _empleadoService: EmpleadoService,
    private toastr: ToastrService,
    private afAuth: AngularFireAuth,
    private router: Router) {

  }

  ngOnInit(): void {
    this.getUsuarios();
  }
  getUsuarios() {
    this._empleadoService.getUsuarios().subscribe(data => {
      this.empleados = [];
      data.forEach((element: any) => {

        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })

      });
      console.log(this.empleados)
    })
  }

  eliminarUsuario(id: string) {
    this.loading = true;
    this._empleadoService.eliminarUsuario(id).then(() => {
      this.toastr.error('Usuario Eliminado con exito', 'Registro Eliminado');
    }).catch(error => {
      this.loading = false;
      console.log(error)
    })

  }
  logOut() {
    this.afAuth.signOut().then(() => this.router.navigate(['/login']));
  }
}

