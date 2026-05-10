import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonMenuButton, IonIcon, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline, closeOutline, alertCircleOutline,
  checkmarkCircleOutline, warningOutline, menuOutline,
  layersOutline,
} from 'ionicons/icons';
import { MateriaPrimaService } from '../../data/services/materia-prima.service';
import {
  MateriaPrima,
  CreateMateriaPrimaRequest,
} from '../../data/interfaces/materia-prima.interface';

type EstadoStock = 'CRÍTICO' | 'NORMAL' | 'EXCESO';

interface MateriaPrimaVM extends MateriaPrima {
  estado_stock: EstadoStock;
}

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonMenuButton, IonIcon, IonSpinner,
  ],
})
export class InventarioPage implements OnInit {

  cargando = false;
  formularioVisible = false;
  materias: MateriaPrimaVM[] = [];

  nuevaMateria: CreateMateriaPrimaRequest = {
    nombre: '',
    descripcion: '',
    cantidad_disponible: 0,
    unidad_medida: 'kg',
    stock_minimo: 0,
    stock_maximo: 0,
    fecha_vencimiento: '',
  };

  unidades = ['kg', 'g', 'l', 'ml', 'unidad', 'docena', 'caja'];

  constructor(private materiaPrimaService: MateriaPrimaService) {
    addIcons({
      addCircleOutline, closeOutline, alertCircleOutline,
      checkmarkCircleOutline, warningOutline, menuOutline, layersOutline,
    });
  }

  ngOnInit(): void {
    this.cargarMaterias();
  }

  cargarMaterias(): void {
    this.cargando = true;
    this.materiaPrimaService.getMateriaPrimas().subscribe({
      next: (data: MateriaPrima[]) => {
        this.materias = data.map((m) => ({
          ...m,
          estado_stock: this.calcularEstado(
            m.cantidad_disponible,
            m.stock_minimo,
            m.stock_maximo,
          ),
        }));
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar materias:', err);
        this.cargando = false;
      },
    });
  }

  toggleFormulario(): void {
    this.formularioVisible = !this.formularioVisible;
    if (!this.formularioVisible) this.resetFormulario();
  }

  resetFormulario(): void {
    this.nuevaMateria = {
      nombre: '', descripcion: '', cantidad_disponible: 0,
      unidad_medida: 'kg', stock_minimo: 0, stock_maximo: 0, fecha_vencimiento: '',
    };
  }

  guardarMateria(): void {
    if (!this.nuevaMateria.nombre.trim()) return;

    this.materiaPrimaService.crearMateriaPrima(this.nuevaMateria).subscribe({
      next: (creada: MateriaPrima) => {
        const nueva: MateriaPrimaVM = {
          ...creada,
          estado_stock: this.calcularEstado(
            creada.cantidad_disponible,
            creada.stock_minimo,
            creada.stock_maximo,
          ),
        };
        this.materias = [nueva, ...this.materias];
        this.toggleFormulario();
      },
      error: (err) => {
        console.error('Error al guardar materia:', err);
      },
    });
  }

  calcularEstado(cantidad: number, min: number, max: number): EstadoStock {
    if (cantidad <= min) return 'CRÍTICO';
    if (cantidad >= max) return 'EXCESO';
    return 'NORMAL';
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}