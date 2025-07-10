import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, Subject } from 'rxjs';
import { NotificationService } from '../../share/notification-service';
import { PromocionService } from '../../share/services/promocion.service';

@Component({
  selector: 'app-promocion-form',
  templateUrl: './promocion-form.html',
  styleUrls: ['./promocion-form.css'],
  standalone:false
})
export class PromocionForm implements OnInit, OnDestroy {
  formPromocion!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private promocionService: PromocionService,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    this.formPromocion = this.fb.group({
      nombre: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      idCategoria: [null], // opcional
      idproducto: [null]   // opcional
    });
  }

  submitPromocion() {
    if (this.formPromocion.invalid) {
      this.noti.error(
        'Formulario inválido',
        'Revisá que los campos obligatorios estén completos.',
        4000
      );
      return;
    }

    const data = this.formPromocion.value;

    // Enviar al backend
    this.promocionService.create(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.noti.success('Promoción creada', `ID: ${res.id}`, 3000);
          this.formPromocion.reset();
        },
        error: (err) => {
          console.error(err);
          this.noti.error('Error', 'No se pudo crear la promoción.', 4000);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
