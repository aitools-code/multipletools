
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-winner-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div class="relative bg-gradient-to-br from-gray-800 to-indigo-900 rounded-2xl shadow-2xl p-8 text-center border-2 border-yellow-400 modal-scale-up">
    
    <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 rounded-full p-4 border-4 border-gray-800">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    </div>

    <h2 class="text-2xl font-bold text-gray-300 mt-10">Congratulations!</h2>
    <p class="text-lg text-indigo-300 mt-2">The winner is...</p>
    
    <div class="my-6 p-4 bg-gray-900/50 rounded-lg border border-yellow-500">
      <p class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 break-words">
        {{ winner() }}
      </p>
    </div>

    <button 
      (click)="onClose()"
      class="mt-4 px-8 py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 transition-colors duration-300 transform hover:scale-105">
      Play Again
    </button>
  </div>
</div>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerModalComponent {
  winner = input.required<string>();
  close = output<void>();

  onClose() {
    this.close.emit();
  }
}

// We need a separate CSS file for keyframe animations
// as Tailwind doesn't easily support them inline.
const style = document.createElement('style');
style.textContent = `
  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #f00;
    opacity: 0.7;
    animation: confetti-fall 3s ease-out forwards;
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(-100px) rotateZ(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotateZ(720deg);
      opacity: 0;
    }
  }

  .modal-scale-up {
    animation: scale-up 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }

  @keyframes scale-up {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
