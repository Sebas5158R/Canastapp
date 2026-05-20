import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline, closeOutline, restaurantOutline,
  cubeOutline, cashOutline, listOutline,
  chevronDownOutline, chevronUpOutline,
  trashOutline, checkmarkOutline, menuOutline,
} from 'ionicons/icons';

import { ProductoService } from 'src/app/data/services/producto.service';
import { MateriaPrimaService } from 'src/app/data/services/materia-prima.service';
import { ProductosState } from 'src/app/data/state/producto.state';
import { Producto } from 'src/app/data/interfaces/producto.interface';
import { MateriaPrima } from 'src/app/data/interfaces/materia-prima.interface';

interface LineaReceta {
  ingrediente_id: number | null;
  cantidad_necesaria: number | null;
  unidad_medida: string;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class ProductosPage implements OnInit {

  private productoService     = inject(ProductoService);
  private materiaPrimaService = inject(MateriaPrimaService);
  private productosState      = inject(ProductosState);
  private toastCtrl           = inject(ToastController);

  // ─── Estado ────────────────────────────────────────
  productos$    = this.productosState.productos$;
  materiaPrimas = signal<MateriaPrima[]>([]);

  cargando  = signal(false);
  guardando = signal(false);
  errorMsg  = signal('');

  // ─── Modal crear ────────────────────────────────────
  modalAbierto = signal(false);

  // ─── Modal receta (ver) ─────────────────────────────
  modalRecetaAbierto       = signal(false);
  productoRecetaActual     = signal<Producto | null>(null);

  // ─── Expansión de tarjetas ──────────────────────────
  expandidos = new Set<number>();

  // ─── Formulario nuevo producto ──────────────────────
  form = {
    nombre: '',
    descripcion: '',
    unidad_medida: 'unidad',
    costo_estimado: null as number | null,
  };

  lineasReceta: LineaReceta[] = [];

  // ─── Lookup rápido de materia prima ─────────────────
  materiaPrimaMap = computed(() => {
    const map = new Map<number, MateriaPrima>();
    this.materiaPrimas().forEach(mp => map.set(mp.id, mp));
    return map;
  });

  constructor() {
    addIcons({
      addOutline, closeOutline, restaurantOutline,
      cubeOutline, cashOutline, listOutline,
      chevronDownOutline, chevronUpOutline,
      trashOutline, checkmarkOutline, menuOutline,
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.productoService.getProductos().subscribe({
      next: () => this.cargando.set(false),
      error: () => this.cargando.set(false),
    });
    this.materiaPrimaService.obtenerInventario().subscribe({
      next: (lista) => this.materiaPrimas.set(lista),
    });
  }

  // ─── Expansión de tarjetas ────────────────────────────
  toggleExpansion(id: number): void {
    this.expandidos.has(id) ? this.expandidos.delete(id) : this.expandidos.add(id);
  }

  estaExpandido(id: number): boolean {
    return this.expandidos.has(id);
  }

  // ─── Modal ver receta ─────────────────────────────────
  abrirReceta(producto: Producto, event: Event): void {
    event.stopPropagation();
    this.productoRecetaActual.set(producto);
    this.modalRecetaAbierto.set(true);
  }

  cerrarModalReceta(): void {
    this.modalRecetaAbierto.set(false);
    this.productoRecetaActual.set(null);
  }

  // ─── Modal crear ──────────────────────────────────────
  abrirModalCrear(): void {
    this.form = { nombre: '', descripcion: '', unidad_medida: 'unidad', costo_estimado: null };
    this.lineasReceta = Array.from({ length: 4 }, () => ({
      ingrediente_id: null,
      cantidad_necesaria: null,
      unidad_medida: '',
    }));
    this.errorMsg.set('');
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  agregarLinea(): void {
    this.lineasReceta.push({ ingrediente_id: null, cantidad_necesaria: null, unidad_medida: '' });
  }

  eliminarLinea(index: number): void {
    this.lineasReceta.splice(index, 1);
  }

  // Al seleccionar ingrediente: autocompletar unidad_medida desde la materia prima
  onIngredienteChange(index: number): void {
    const linea = this.lineasReceta[index];
    if (!linea.ingrediente_id) return;
    const mp = this.materiaPrimaMap().get(Number(linea.ingrediente_id));
    if (mp) linea.unidad_medida = mp.unidad_medida;
  }

  nombreMateriaPrima(id: number): string {
    return this.materiaPrimaMap().get(id)?.nombre ?? `ID ${id}`;
  }

  // ─── Guardar ──────────────────────────────────────────
  guardar(): void {
    this.errorMsg.set('');

    if (!this.form.nombre.trim()) {
      this.errorMsg.set('El nombre del producto es obligatorio.');
      return;
    }

    const lineasValidas = this.lineasReceta.filter(
      l => l.ingrediente_id && l.cantidad_necesaria && Number(l.cantidad_necesaria) > 0 && l.unidad_medida.trim()
    );

    if (lineasValidas.length === 0) {
      this.errorMsg.set('Agrega al menos un ingrediente con cantidad y unidad de medida.');
      return;
    }

    this.guardando.set(true);

    const payload = {
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion?.trim() || undefined,
      unidad_medida: this.form.unidad_medida || 'unidad',
      costo_estimado: this.form.costo_estimado ?? undefined,
      receta: lineasValidas.map(l => ({
        ingrediente_id: Number(l.ingrediente_id),
        cantidad_necesaria: Number(l.cantidad_necesaria),
        unidad_medida: l.unidad_medida.trim(),
      })),
    };

    this.productoService.crearProducto(payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModal();
        this.mostrarToast('Producto creado correctamente', 'success');
      },
      error: (err) => {
        this.guardando.set(false);
        const msg = err?.error?.message || err?.message || 'Error al crear el producto.';
        this.errorMsg.set(msg);
      },
    });
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'danger') {
    const t = await this.toastCtrl.create({ message: mensaje, duration: 2500, color, position: 'bottom' });
    t.present();
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}
