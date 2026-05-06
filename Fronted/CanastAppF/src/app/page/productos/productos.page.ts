import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonMenuButton, IonIcon, IonBadge,
  IonSearchbar, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, leafOutline, scaleOutline, cashOutline, menuOutline } from 'ionicons/icons';
import { Producto, Receta } from '../../data/interfaces/producto.interface';

interface ProductoConReceta extends Producto {
  recetas: Receta[];
  expandido: boolean;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonMenuButton, IonIcon, IonBadge,
    IonSearchbar, IonSpinner,
  ],
})
export class ProductosPage implements OnInit {

  cargando = false;
  busqueda = '';

  productos: ProductoConReceta[] = [
    {
      id: 1, nombre: 'Pan artesanal', descripcion: 'Pan elaborado con harina de trigo especial',
      unidad_medida: 'unidad', costo_estimado: 2.50,
      expandido: false,
      recetas: [
        { id: 1, producto_id: 1, ingrediente_id: 1, cantidad_necesaria: 0.5, unidad_medida: 'kg' },
        { id: 2, producto_id: 1, ingrediente_id: 2, cantidad_necesaria: 0.1, unidad_medida: 'kg' },
        { id: 3, producto_id: 1, ingrediente_id: 3, cantidad_necesaria: 2,   unidad_medida: 'unidad' },
        { id: 4, producto_id: 1, ingrediente_id: 4, cantidad_necesaria: 0.01,unidad_medida: 'kg' },
      ],
    },
    {
      id: 2, nombre: 'Pan integral', descripcion: 'Pan con harina integral y semillas',
      unidad_medida: 'unidad', costo_estimado: 3.00,
      expandido: false,
      recetas: [
        { id: 5, producto_id: 2, ingrediente_id: 1, cantidad_necesaria: 0.4, unidad_medida: 'kg' },
        { id: 6, producto_id: 2, ingrediente_id: 2, cantidad_necesaria: 0.05,unidad_medida: 'kg' },
      ],
    },
    {
      id: 3, nombre: 'Facturas', descripcion: 'Facturas de manteca',
      unidad_medida: 'docena', costo_estimado: 4.50,
      expandido: false,
      recetas: [
        { id: 7, producto_id: 3, ingrediente_id: 1, cantidad_necesaria: 1,   unidad_medida: 'kg' },
        { id: 8, producto_id: 3, ingrediente_id: 2, cantidad_necesaria: 0.2, unidad_medida: 'kg' },
        { id: 9, producto_id: 3, ingrediente_id: 3, cantidad_necesaria: 4,   unidad_medida: 'unidad' },
      ],
    },
  ];

  /* Nombres de ingredientes (mock hasta que llegue la API) */
  nombreIngrediente: Record<number, string> = {
    1: 'Harina de trigo', 2: 'Azúcar blanca', 3: 'Huevos',
    4: 'Levadura', 5: 'Sal',
  };

  get productosFiltrados(): ProductoConReceta[] {
    if (!this.busqueda.trim()) return this.productos;
    const q = this.busqueda.toLowerCase();
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    );
  }

  constructor() {
    addIcons({ cubeOutline, leafOutline, scaleOutline, cashOutline, menuOutline });
  }

  ngOnInit(): void {}

  toggleProducto(producto: ProductoConReceta): void {
    producto.expandido = !producto.expandido;
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}