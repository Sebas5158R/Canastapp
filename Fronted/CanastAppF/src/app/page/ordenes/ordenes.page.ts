import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonMenuButton, IonIcon, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronDownOutline, chevronUpOutline, timeOutline,
  cubeOutline, calendarOutline, personOutline,
  documentTextOutline, menuOutline, filterOutline,
} from 'ionicons/icons';
import { OrdenProduccion, EstadoOrden } from '../../data/interfaces/orden-produccion.interface';

interface OrdenVM extends OrdenProduccion {
  expandida: boolean;
  nombre_producto: string;
}

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.page.html',
  styleUrls: ['./ordenes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonMenuButton, IonIcon, IonSpinner,
  ],
})
export class OrdenesPage implements OnInit {

  cargando = false;
  filtroActivo: EstadoOrden | 'todas' = 'todas';

  filtros: { label: string; value: EstadoOrden | 'todas' }[] = [
    { label: 'Todas',        value: 'todas' },
    { label: 'Pendiente',    value: 'pendiente' },
    { label: 'En producción',value: 'en_produccion' },
    { label: 'Completada',   value: 'completada' },
    { label: 'Cancelada',    value: 'cancelada' },
  ];

  ordenes: OrdenVM[] = [
    {
      id: 1, producto_id: 1, nombre_producto: 'Pan artesanal',
      cantidad_solicitada: 100, fecha_requerida: '2025-05-20',
      fecha_creacion: '2025-05-10T08:00:00Z', estado: 'en_produccion',
      usuario_creador_id: 2, observaciones: 'Pedido especial para evento',
      notificado_bodega: true, expandida: false,
    },
    {
      id: 2, producto_id: 2, nombre_producto: 'Pan integral',
      cantidad_solicitada: 60, fecha_requerida: '2025-05-22',
      fecha_creacion: '2025-05-11T09:00:00Z', estado: 'pendiente',
      usuario_creador_id: 2, observaciones: '',
      notificado_bodega: false, expandida: false,
    },
    {
      id: 3, producto_id: 3, nombre_producto: 'Facturas',
      cantidad_solicitada: 24, fecha_requerida: '2025-05-15',
      fecha_creacion: '2025-05-08T10:00:00Z', estado: 'completada',
      usuario_creador_id: 2, observaciones: 'Entregado sin incidencias',
      notificado_bodega: true, expandida: false,
    },
    {
      id: 4, producto_id: 1, nombre_producto: 'Pan artesanal',
      cantidad_solicitada: 50, fecha_requerida: '2025-05-12',
      fecha_creacion: '2025-05-05T07:00:00Z', estado: 'cancelada',
      usuario_creador_id: 2, observaciones: 'Cancelada por falta de insumos',
      notificado_bodega: false, expandida: false,
    },
  ];

  get ordenesFiltradas(): OrdenVM[] {
    if (this.filtroActivo === 'todas') return this.ordenes;
    return this.ordenes.filter(o => o.estado === this.filtroActivo);
  }

  constructor() {
    addIcons({
      chevronDownOutline, chevronUpOutline, timeOutline,
      cubeOutline, calendarOutline, personOutline,
      documentTextOutline, menuOutline, filterOutline,
    });
  }

  ngOnInit(): void {}

  toggleOrden(orden: OrdenVM): void {
    orden.expandida = !orden.expandida;
  }

  setFiltro(valor: EstadoOrden | 'todas'): void {
    this.filtroActivo = valor;
  }

  etiquetaEstado(estado: EstadoOrden): string {
    const map: Record<EstadoOrden, string> = {
      pendiente:     'Pendiente',
      en_produccion: 'En producción',
      completada:    'Completada',
      cancelada:     'Cancelada',
    };
    return map[estado];
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}
