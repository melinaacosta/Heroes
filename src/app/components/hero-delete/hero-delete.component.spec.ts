import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDeleteComponent } from './hero-delete.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HeroDeleteComponent', () => {
  let component: HeroDeleteComponent;
  let fixture: ComponentFixture<HeroDeleteComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<HeroDeleteComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [HeroDeleteComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Confirmar borrado?' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with true when confirm is called', () => {
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when cancel is called', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
