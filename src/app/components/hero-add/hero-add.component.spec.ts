import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroAddComponent } from './hero-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';

describe('HeroAddComponent', () => {
  let component: HeroAddComponent;
  let fixture: ComponentFixture<HeroAddComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<HeroAddComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        HeroAddComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.heroeForm.valid).toBeFalsy();
  });

  it('nombre field validity', () => {
    const nombre = component.heroeForm.controls['nombre'];
    expect(nombre.valid).toBeFalsy();

    nombre.setValue('');
    expect(nombre.hasError('required')).toBeTruthy();

    nombre.setValue('Superman');
    expect(nombre.hasError('required')).toBeFalsy();
  });

  it('should close dialog with form value on submit when form is valid', () => {
    component.heroeForm.setValue({
      id: null,
      nombre: 'Batman',
      imagen: 'batman.png',
      descripcion: 'Dark Knight'
    });

    expect(component.heroeForm.valid).toBeTrue();

    component.onSubmit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      id: null,
      nombre: 'Batman',
      imagen: 'batman.png',
      descripcion: 'Dark Knight'
    });
  });

  it('should not close dialog on submit when form is invalid', () => {
    component.heroeForm.setValue({
      id: null,
      nombre: '',
      imagen: '',
      descripcion: ''
    });

    expect(component.heroeForm.invalid).toBeTrue();

    component.onSubmit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close dialog with no data on cancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('submit button should be disabled if form is invalid', () => {
    component.heroeForm.controls['nombre'].setValue('');
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
    expect(submitBtn.disabled).toBeTrue();

    component.heroeForm.controls['nombre'].setValue('Wonder Woman');
    component.heroeForm.controls['imagen'].setValue('ww.png');
    component.heroeForm.controls['descripcion'].setValue('Amazon Princess');
    fixture.detectChanges();

    expect(submitBtn.disabled).toBeFalse();
  });
});
