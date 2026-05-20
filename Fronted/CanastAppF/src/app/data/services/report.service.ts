import {
  Injectable,
} from '@angular/core';

import jsPDF
from 'jspdf';

import autoTable
from 'jspdf-autotable';

import * as XLSX
from 'xlsx';

import {
  saveAs,
} from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  generarPDFProduccion(
    ordenes: any[]
  ): void {

    const doc =
      new jsPDF();

    doc.setFontSize(18);

    doc.text(
      'Reporte Producción',
      14,
      20
    );

    autoTable(doc, {

      startY: 30,

      head: [[

        'Producto',
        'Cantidad',
        'Estado',
        'Fecha',
      ]],

      body: ordenes.map(
        (orden) => [

          orden.producto_nombre,

          orden.cantidad,

          orden.estado,

          orden.fecha_programada,
        ]
      ),
    });

    doc.save(
      'produccion.pdf'
    );
  }

  generarExcelInventario(
    inventario: any[]
  ): void {

    const worksheet =
      XLSX.utils
        .json_to_sheet(
          inventario
        );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      'Inventario'
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: 'xlsx',
          type: 'array',
        }
      );

    const blob =
      new Blob(
        [excelBuffer],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        }
      );

    saveAs(
      blob,
      'inventario.xlsx'
    );
  }

  generarPDFMovimientos(
    movimientos: any[]
  ): void {

    const doc =
      new jsPDF();

    doc.setFontSize(18);

    doc.text(
      'Movimientos Inventario',
      14,
      20
    );

    autoTable(doc, {

      startY: 30,

      head: [[

        'Materia Prima',
        'Tipo',
        'Cantidad',
        'Fecha',
      ]],

      body: movimientos.map(
        (movimiento) => [

          movimiento.materia_prima,

          movimiento.tipo,

          movimiento.cantidad,

          movimiento.createdAt,
        ]
      ),
    });

    doc.save(
      'movimientos.pdf'
    );
  }
}