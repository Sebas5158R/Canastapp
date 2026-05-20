import {
  Injectable,
} from '@angular/core';

import * as XLSX
from 'xlsx';

import {
  saveAs,
} from 'file-saver';

import jsPDF
from 'jspdf';

import autoTable
from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  // ============================================
  // EXPORT EXCEL
  // ============================================

  exportToExcel(

    data: any[],

    fileName: string

  ): void {

    const worksheet =
      XLSX.utils.json_to_sheet(
        data
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      'Reporte'
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
      `${fileName}.xlsx`
    );
  }

  // ============================================
  // EXPORT PDF
  // ============================================

  exportToPDF(

    title: string,

    headers: string[],

    data: any[],

    fileName: string

  ): void {

    const doc =
      new jsPDF();

    doc.setFontSize(18);

    doc.text(
      title,
      14,
      20
    );

    autoTable(doc, {

      head: [headers],

      body: data,

      startY: 30,
    });

    doc.save(
      `${fileName}.pdf`
    );
  }
}