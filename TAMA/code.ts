class Tamagotchi {
  private name: string;
  private animalType: string;
  private hunger: number;
  private happiness: number;

  constructor(name: string, animalType: string) {
    this.name = name;
    this.animalType = animalType;
    this.hunger = 5;
    this.happiness = 5;
  }

  public feed(): void {
    if (this.hunger > 0) {
      this.hunger -= 1;
      console.log(`Hai nutrito ${this.name}. Fame: ${this.hunger}`);
    } else {
      console.log(`${this.name} non ha fame.`);
    }
  }

  public play(): void {
    if (this.happiness < 10) {
      this.happiness += 1;
      console.log(`Hai giocato con ${this.name}. Felicità: ${this.happiness}`);
    } else {
      console.log(`${this.name} è già felice.`);
    }
  }

  public updateStatus(): void {
    this.hunger += 0.1;
    this.happiness -= 0.1;

    if (this.hunger >= 10) {
      console.log(`${this.name} è morto di fame.`);
      process.exit();
    }

    if (this.happiness <= 0) {
      console.log(`${this.name} è morto di tristezza.`);
      process.exit();
    }

    console.log(`Fame: ${this.hunger.toFixed(1)}, Felicità: ${this.happiness.toFixed(1)}`);
  }
}

// Creazione di un nuovo Tamagotchi
const tamagotchiName = prompt("Inserisci il nome del tuo Tamagotchi: ");
const tamagotchiType = prompt("Inserisci il tipo di animale: ");

const myTamagotchi = new Tamagotchi(tamagotchiName, tamagotchiType);

// Interazione con il Tamagotchi
setInterval(() => {
  myTamagotchi.updateStatus();
}, 1000);

// Simulazione di interazione manuale
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.setPrompt('Cosa vuoi fare? (feed/play/exit): ');
readline.prompt();

readline.on('line', (line) => {
  switch (line.trim()) {
    case 'feed':
      myTamagotchi.feed();
      break;
    case 'play':
      myTamagotchi.play();
      break;
    case 'exit':
      process.exit();
    default:
      console.log('Comando non riconosciuto.');
  }
  readline.prompt();
});
