const fs = require('fs');
const path = require('path');

const SOUNDS_DIR = path.join(__dirname, '..', 'assets', 'sounds');
const SAMPLE_RATE = 44100;

function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Diretório criado: ${dirPath}`);
  }
}

function writeWav(filename, samples) {
  const filepath = path.join(SOUNDS_DIR, filename);
  const dataSize = samples.length * 2; // 16-bit = 2 bytes por amostra
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Chunk size
  buffer.writeUInt16LE(1, 20);  // Format: 1 (PCM)
  buffer.writeUInt16LE(1, 22);  // Channels: 1 (Mono)
  buffer.writeUInt32LE(SAMPLE_RATE, 24); // Sample Rate
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // Byte Rate
  buffer.writeUInt16LE(2, 32);  // Block Align
  buffer.writeUInt16LE(16, 34); // Bits per Sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const val = Math.round(sample === 1 ? 32767 : sample * 32768);
    buffer.writeInt16LE(val, offset);
    offset += 2;
  }

  fs.writeFileSync(filepath, buffer);
  console.log(`Áudio procedural sintetizado com sucesso: ${filename}`);
}

// --- PROCEDURAL SOUND GENERATORS ---

function gerarConclusaoSerie() {
  // Clique seco agudo e curto (60ms)
  const duration = 0.060;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = [];
  const freq = 1100.0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const envelope = Math.exp(-70.0 * t);
    const val = Math.sin(2.0 * Math.PI * freq * t) * envelope;
    samples.push(val);
  }

  writeWav('conclusao-serie.wav', samples);
}

function gerarFimDescanso() {
  // Arpejo de 3 notas ascendentes (C5 -> E5 -> G5) em 400ms
  const duration = 0.400;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = [];

  const notas = [
    { start: 0.00, end: 0.12, freq: 523.25 },
    { start: 0.12, end: 0.24, freq: 659.25 },
    { start: 0.24, end: 0.40, freq: 783.99 }
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let val = 0.0;

    for (const nota of notas) {
      if (t >= nota.start && t < nota.end) {
        const localT = t - nota.start;
        const localDur = nota.end - nota.start;
        const envelope = Math.sin(Math.PI * (localT / localDur)) * Math.exp(-3.0 * localT);
        val = Math.sin(2.0 * Math.PI * nota.freq * localT) * envelope * 0.7;
        break;
      }
    }
    samples.push(val);
  }

  writeWav('fim-descanso.wav', samples);
}

function gerarConclusaoExercicio() {
  // Acorde harmônico positivo (C5 + G5 + C6) tocados juntos (450ms)
  const duration = 0.450;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = [];
  const freqs = [523.25, 783.99, 1046.50];

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const envelope = Math.exp(-8.0 * t) * Math.sin(Math.PI * (t / duration));

    let val = 0;
    for (const f of freqs) {
      val += Math.sin(2.0 * Math.PI * f * t);
    }
    val = (val / freqs.length) * envelope * 0.8;
    samples.push(val);
  }

  writeWav('conclusao-exercicio.wav', samples);
}

function gerarConclusaoSessao() {
  // Jingle alegre curto de vitória ~1.0s (C5 -> E5 -> G5 -> C6 sustentada)
  const duration = 1.0;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = [];

  const notas = [
    { start: 0.00, end: 0.15, freq: 523.25 },
    { start: 0.15, end: 0.30, freq: 659.25 },
    { start: 0.30, end: 0.45, freq: 783.99 },
    { start: 0.45, end: 1.00, freq: 1046.50 }
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let val = 0.0;

    for (const nota of notas) {
      if (t >= nota.start && t < nota.end) {
        const localT = t - nota.start;
        const localDur = nota.end - nota.start;
        let envelope = 0;

        if (nota.freq === 1046.50) {
          envelope = Math.exp(-3.5 * localT) * 0.7;
        } else {
          envelope = Math.sin(Math.PI * (localT / localDur)) * 0.6;
        }

        val = Math.sin(2.0 * Math.PI * nota.freq * localT) * envelope;
        break;
      }
    }
    samples.push(val);
  }

  writeWav('conclusao-sessao.wav', samples);
}

function gerarConquista() {
  // Tigela tibetana / som harmônico rico (1.6s) com tremolo e múltiplas harmônicas
  const duration = 1.6;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = [];
  const freqs = [220.0, 440.0, 660.0, 880.0, 1320.0];
  const weights = [1.0, 0.6, 0.4, 0.2, 0.1];
  const sumWeights = weights.reduce((a, b) => a + b, 0);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const envelope = Math.exp(-2.2 * t) * (1.0 - Math.exp(-15.0 * t));
    const tremolo = 1.0 + 0.25 * Math.sin(2.0 * Math.PI * 6.0 * t);

    let signal = 0.0;
    for (let f = 0; f < freqs.length; f++) {
      signal += Math.sin(2.0 * Math.PI * freqs[f] * t) * weights[f];
    }

    const val = (signal / sumWeights) * envelope * tremolo * 0.85;
    samples.push(val);
  }

  writeWav('conquista.wav', samples);
}

function gerarTierTransicao() {
  // Arpejo cintilante, muito rápido ascendente (E6 -> G6 -> B6 -> E7)
  const duration = 0.600;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = [];

  const notas = [
    { start: 0.00, end: 0.10, freq: 1318.51 }, // E6
    { start: 0.10, end: 0.20, freq: 1567.98 }, // G6
    { start: 0.20, end: 0.30, freq: 1975.53 }, // B6
    { start: 0.30, end: 0.60, freq: 2637.02 }  // E7
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let val = 0.0;

    for (const nota of notas) {
      if (t >= nota.start && t < nota.end) {
        const localT = t - nota.start;
        const localDur = nota.end - nota.start;
        let envelope = 0;

        if (nota.freq === 2637.02) {
          envelope = Math.exp(-5.0 * localT) * 0.6;
        } else {
          envelope = Math.sin(Math.PI * (localT / localDur)) * 0.5;
        }

        const vibrato = 1.0 + 0.01 * Math.sin(2.0 * Math.PI * 10.0 * localT);
        val = Math.sin(2.0 * Math.PI * nota.freq * vibrato * localT) * envelope;
        break;
      }
    }
    samples.push(val);
  }

  writeWav('tier-transicao.wav', samples);
}

function gerarCancelamento() {
  // Tom neutro e descendente de 250Hz a 130Hz (300ms)
  const duration = 0.300;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = [];

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 250.0 - (120.0 * (t / duration));
    const envelope = Math.sin(Math.PI * (t / duration)) * Math.exp(-3.0 * t);
    const val = Math.sin(2.0 * Math.PI * freq * t) * envelope * 0.7;
    samples.push(val);
  }

  writeWav('cancelamento.wav', samples);
}

function principal() {
  console.log('Iniciando síntese de áudio procedural em Node.js...');
  ensureDirectoryExistence(SOUNDS_DIR);

  gerarConclusaoSerie();
  gerarFimDescanso();
  gerarConclusaoExercicio();
  gerarConclusaoSessao();
  gerarConquista();
  gerarTierTransicao();
  gerarCancelamento();

  console.log('Todos os sons procedurais foram gerados com sucesso!');
}

principal();
