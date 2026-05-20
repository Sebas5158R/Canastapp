import {
  Component,
  inject,
  OnInit,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  IonicModule,
} from '@ionic/angular';

import {
  ProductoService,
} from 'src/app/data/services/producto.service';

import { ProductosState } from 'src/app/data/state/producto.state';

@Component({
  selector: 'app-productos',

  templateUrl:
    './productos.page.html',

  styleUrls: [
    './productos.page.scss',
  ],

  standalone: true,

  imports: [
    CommonModule,
    IonicModule,
  ],
})
export class ProductosPage
implements OnInit {

  private productoService =
    inject(ProductoService);

  private productosState =
    inject(ProductosState);

  productos$ =
    this.productosState.productos$;

  ngOnInit(): void {

    this.cargarProductos();
  }

  cargarProductos(): void {

    this.productoService
      .getProductos()
      .subscribe();
  }
}