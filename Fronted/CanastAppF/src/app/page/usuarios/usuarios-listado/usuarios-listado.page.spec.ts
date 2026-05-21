import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosListadoPage } from './usuarios-listado.page';

describe('UsuariosListadoPage', () => {
  let component: UsuariosListadoPage;
  let fixture: ComponentFixture<UsuariosListadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosListadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
