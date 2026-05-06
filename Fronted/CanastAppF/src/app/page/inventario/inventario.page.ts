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

  /* Datos mock hasta que llegue la API */
  materias: MateriaPrimaVM[] = [
    { id: 1, nombre: 'Harina de trigo',  cantidad_disponible: 500, unidad_medida: 'kg',     stock_minimo: 50,  stock_maximo: 2000, fecha_vencimiento: '2025-12-31', estado_inventario: 'activo', estado_stock: 'NORMAL' },
    { id: 2, nombre: 'Azúcar blanca',    cantidad_disponible: 30,  unidad_medida: 'kg',     stock_minimo: 30,  stock_maximo: 1500, fecha_vencimiento: '2025-10-15', estado_inventario: 'activo', estado_stock: 'CRÍTICO' },
    { id: 3, nombre: 'Huevos',           cantidad_disponible: 1000,unidad_medida: 'unidad', stock_minimo: 100, stock_maximo: 5000, fecha_vencimiento: '2025-05-20', estado_inventario: 'activo', estado_stock: 'NORMAL' },
    { id: 4, nombre: 'Levadura',         cantidad_disponible: 8,   unidad_medida: 'kg',     stock_minimo: 10,  stock_maximo: 200,  fecha_vencimiento: '2025-08-01', estado_inventario: 'activo', estado_stock: 'CRÍTICO' },
    { id: 5, nombre: 'Sal',              cantidad_disponible: 2000,unidad_medida: 'kg',     stock_minimo: 15,  stock_maximo: 300,  fecha_vencimiento: '2026-01-10', estado_inventario: 'activo', estado_stock: 'EXCESO'  },
  ];

  /* Formulario nueva materia prima */
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

  constructor() {
    addIcons({
      addCircleOutline, closeOutline, alertCircleOutline,
      checkmarkCircleOutline, warningOutline, menuOutline, layersOutline,
    });
  }

  ngOnInit(): void {}

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

    /* Mock: agregar al listado local; luego reemplazar con MateriaPrimaService.crearMateriaPrima() */
    const nueva: MateriaPrimaVM = {
      id: this.materias.length + 1,
      nombre: this.nuevaMateria.nombre,
      descripcion: this.nuevaMateria.descripcion,
      cantidad_disponible: this.nuevaMateria.cantidad_disponible,
      unidad_medida: this.nuevaMateria.unidad_medida,
      stock_minimo: this.nuevaMateria.stock_minimo ?? 0,
      stock_maximo: this.nuevaMateria.stock_maximo ?? 999999,
      fecha_vencimiento: this.nuevaMateria.fecha_vencimiento,
      estado_inventario: 'activo',
      estado_stock: this.calcularEstado(
        this.nuevaMateria.cantidad_disponible,
        this.nuevaMateria.stock_minimo ?? 0,
        this.nuevaMateria.stock_maximo ?? 999999,
      ),
    };
    this.materias = [nueva, ...this.materias];
    this.toggleFormulario();
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
