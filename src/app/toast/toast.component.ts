import { Component, OnInit } from '@angular/core';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  toasts: ToastMessage[] = [];

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    const toast: ToastMessage = { message, type };
    this.toasts.push(toast);

    // Remover o toast após 3.5 segundos
    setTimeout(() => {
      this.toasts.shift();
    }, 4000);
  }

  getIcon(type: 'success' | 'error' | 'warning' | 'info'): string {
    const icons: { [key: string]: string } = {
      success: '✅', // Ícone de sucesso
      error: '❌', // Ícone de erro
      warning: '⚠️', // Ícone de aviso
      info: 'ℹ️', // Ícone de informação
    };
    return icons[type] || 'ℹ️'; // Padrão para ícone de informação
  }
}
