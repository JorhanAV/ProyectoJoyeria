import { Component, computed, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pago-modal',
  templateUrl: './pago-modal.component.html',
  styleUrls: ['./pago-modal.css'],
  standalone: false,
})
export class PagoModalComponent implements OnInit {
  metodo_pago = '';
  total = 0;

  montoRecibido = signal(0);
  vuelto = computed(() => {
    const recibido = this.montoRecibido();
    return recibido >= this.total ? recibido - this.total : 0;
  });

  error = signal('');
  tarjeta = {
    numero: '',
    expiracion: '',
    cvv: '',
    titular: '',
  };

  efectivo = {
    montoRecibido: 0,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PagoModalComponent>
  ) {}

  ngOnInit() {
    this.metodo_pago = this.data.metodo_pago;
    this.total = this.data.total;
  }

  validarTarjeta(): boolean {
    this.error.set('');

    // Número: 16 dígitos numéricos
    if (!/^\d{16}$/.test(this.tarjeta.numero)) {
      this.error.set(
        'Número de tarjeta inválido (debe tener 16 dígitos numéricos)'
      );
      return false;
    }

    // Fecha expiración MM/AA y no anterior a hoy
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.tarjeta.expiracion)) {
      this.error.set('Fecha de expiración inválida (formato MM/AA)');
      return false;
    }
    if (!this.fechaValida(this.tarjeta.expiracion)) {
      this.error.set('La tarjeta está expirada');
      return false;
    }

    // CVV 3 o 4 dígitos numéricos
    if (!/^\d{3,4}$/.test(this.tarjeta.cvv)) {
      this.error.set('CVV inválido (3 o 4 dígitos numéricos)');
      return false;
    }

    // Titular no vacío
    if (!this.tarjeta.titular.trim()) {
      this.error.set('El nombre del titular es obligatorio');
      return false;
    }

    return true;
  }

  fechaValida(exp: string): boolean {
    // Expiracion MM/AA
    const [mesStr, anioStr] = exp.split('/');
    const mes = Number(mesStr);
    const anio = Number('20' + anioStr);
    if (mes < 1 || mes > 12) return false;

    const hoy = new Date();
    const fechaExp = new Date(anio, mes); // primer día del mes siguiente

    return fechaExp > hoy;
  }

  validarEfectivo(): boolean {
    this.error.set('');
    if (isNaN(this.montoRecibido()) || this.efectivo.montoRecibido <= 0) {
      this.error.set('El monto recibido debe ser un número positivo');
      return false;
    }
    if (this.montoRecibido() < this.total) {
      this.error.set('El monto recibido no puede ser menor al total');
      return false;
    }
    return true;
  }
  confirmar() {
    this.error.set('');
    const recibido = this.montoRecibido();
    if (this.metodo_pago === 'Efectivo') {
      if (!this.validarEfectivo()) {
        this.error.set('El monto recibido no puede ser menor al total');
        return;
      }
      this.dialogRef.close({
        metodo: 'Efectivo',
        montoRecibido: recibido,
        vuelto: this.vuelto(),
      });
    } else {
      if (!this.validarTarjeta()) {
         this.error.set('Hubo un error con los valores de la tarjeta');
        return;
      }
      this.dialogRef.close({ metodo: 'tarjeta', datos: this.tarjeta });
    }
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
