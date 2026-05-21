import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditarUsuarioModalComponent } from './editar-usuario-modal.component';

describe('EditarUsuarioModalComponent', () => {
  let component: EditarUsuarioModalComponent;
  let fixture: ComponentFixture<EditarUsuarioModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EditarUsuarioModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarUsuarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
