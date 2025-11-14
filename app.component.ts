
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WinnerModalComponent } from './components/winner-modal/winner-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, WinnerModalComponent],
  template: `
<div class="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 p-4 sm:p-6 lg:p-8 font-sans">
  <div class="max-w-4xl mx-auto">
    
    <header class="text-center mb-8">
      <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        Lagee Winner Draw
      </h1>
      <p class="text-indigo-300 mt-2 text-lg">Who will be the lucky one?</p>
    </header>

    <main class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <!-- Left Column: Controls -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl shadow-indigo-900/50 border border-gray-700">
        <h2 class="text-2xl font-semibold mb-4 text-indigo-300">Add Participants</h2>
        
        <!-- Manual Entry -->
        <form (submit)="$event.preventDefault(); addParticipant()" class="flex gap-2 mb-4">
          <input 
            type="text" 
            placeholder="Enter a name..."
            [value]="newParticipantName()"
            (input)="handleNameInput($event)"
            class="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
          >
          <button 
            type="submit" 
            [disabled]="!newParticipantName().trim()"
            class="px-5 py-2 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300">
            Add
          </button>
        </form>

        <!-- File Upload -->
        <div class="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors duration-300">
          <svg class="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <label for="file-upload" class="relative cursor-pointer mt-2 text-indigo-400 hover:text-indigo-300 font-medium">
            <span>Upload a file</span>
            <input id="file-upload" name="file-upload" type="file" class="sr-only" (change)="onFileSelected($event)" accept=".txt">
          </label>
          <p class="text-xs text-gray-500 mt-1">TXT with one name per line</p>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4">
          <button 
            (click)="drawWinner()" 
            [disabled]="!canDraw()"
            class="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-lg hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg disabled:shadow-none">
            ✨ Draw Winner
          </button>
          <button
            (click)="reset()"
            class="w-full sm:w-auto px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300">
            Reset
          </button>
        </div>
      </div>

      <!-- Right Column: Participant List -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl shadow-indigo-900/50 border border-gray-700">
        <h2 class="text-2xl font-semibold mb-4 text-indigo-300 flex justify-between items-center">
          <span>Participant List</span>
          <span class="text-sm font-normal bg-indigo-500/20 text-indigo-300 rounded-full px-3 py-1">
            {{ participants().length }}
          </span>
        </h2>
        
        @if (participants().length === 0) {
          <div class="flex flex-col items-center justify-center h-full text-gray-500 py-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="mt-4">No participants yet.</p>
            <p class="text-sm">Add names or upload a file to begin.</p>
          </div>
        } @else {
          <ul class="space-y-2 h-80 overflow-y-auto pr-2">
            @for (participant of participants(); track participant; let i = $index) {
              <li 
                class="flex items-center justify-between p-3 rounded-lg transition-all duration-200"
                [class.bg-yellow-400]="highlightedIndex() === i"
                [class.text-gray-900]="highlightedIndex() === i"
                [class.font-bold]="highlightedIndex() === i"
                [class.bg-gray-900/50]="highlightedIndex() !== i"
                [class.text-indigo-200]="highlightedIndex() !== i"
              >
                <span class="truncate">{{ i + 1 }}. {{ participant }}</span>
                <button (click)="removeParticipant(i)" class="ml-4 text-gray-500 hover:text-red-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            }
          </ul>
        }
      </div>
    </main>
    
    @if (winner()) {
      <app-winner-modal [winner]="winner()!" (close)="closeWinnerModal()" />
    }

  </div>
</div>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  newParticipantName = signal('');
  participants = signal<string[]>([]);
  winner = signal<string | null>(null);
  isDrawing = signal(false);
  highlightedIndex = signal<number | null>(null);

  canDraw = computed(() => this.participants().length >= 2 && !this.isDrawing());

  addParticipant(): void {
    const name = this.newParticipantName().trim();
    if (name) {
      this.participants.update(p => [...p, name]);
      this.newParticipantName.set('');
    }
  }

  handleNameInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.newParticipantName.set(inputElement.value);
  }

  removeParticipant(indexToRemove: number): void {
    this.participants.update(p => p.filter((_, index) => index !== indexToRemove));
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const names = text.split('\n').map(name => name.trim()).filter(name => name.length > 0);
        this.participants.update(p => [...p, ...names]);
      };
      reader.readAsText(file);
      input.value = ''; // Reset file input
    }
  }

  drawWinner(): void {
    if (!this.canDraw()) return;

    this.isDrawing.set(true);
    this.winner.set(null);
    const participantList = this.participants();
    const duration = 3000; // 3 seconds for the animation
    const intervalTime = 75; // update every 75ms
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      const randomIndex = Math.floor(Math.random() * participantList.length);
      this.highlightedIndex.set(randomIndex);
      
      if (elapsed >= duration) {
        clearInterval(interval);
        const finalWinnerIndex = Math.floor(Math.random() * participantList.length);
        this.highlightedIndex.set(finalWinnerIndex);
        
        setTimeout(() => {
          this.winner.set(participantList[finalWinnerIndex]);
          this.isDrawing.set(false);
        }, 500); // short pause on the winner
      }
    }, intervalTime);
  }

  reset(): void {
    this.participants.set([]);
    this.winner.set(null);
    this.isDrawing.set(false);
    this.highlightedIndex.set(null);
    this.newParticipantName.set('');
  }

  closeWinnerModal(): void {
    this.winner.set(null);
    this.highlightedIndex.set(null);
  }
}
