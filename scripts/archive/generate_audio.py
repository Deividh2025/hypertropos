import os
import sys
import wave
import struct
import math
import urllib.request

# Configurações de saída
SOUNDS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'sounds')
SAMPLE_RATE = 44100

# URLs públicas estáveis de CDN para download (open-source) como primeira tentativa
# Caso estas URLs falhem, a geração procedural assume com 100% de confiabilidade.
AUDIO_URLS = {
    'conclusao-serie.wav': 'https://raw.githubusercontent.com/Deividh2025/hypertropos-audio/main/conclusao-serie.wav',
    'fim-descanso.wav': 'https://raw.githubusercontent.com/Deividh2025/hypertropos-audio/main/fim-descanso.wav',
    'conclusao-exercicio.wav': 'https://raw.githubusercontent.com/Deividh2025/hypertropos-audio/main/conclusao-exercicio.wav',
    'conclusao-sessao.wav': 'https://raw.githubusercontent.com/Deividh2025/hypertropos-audio/main/conclusao-sessao.wav',
    'conquista.wav': 'https://raw.githubusercontent.com/Deividh2025/hypertropos-audio/main/conquista.wav',
    'tier-transicao.wav': 'https://raw.githubusercontent.com/Deividh2025/hypertropos-audio/main/tier-transicao.wav',
    'cancelamento.wav': 'https://raw.githubusercontent.com/Deividh2025/hypertropos-audio/main/cancelamento.wav'
}

def garantir_diretorio():
    if not os.path.exists(SOUNDS_DIR):
        os.makedirs(SOUNDS_DIR)
        print(f"Diretório criado: {SOUNDS_DIR}")

def write_wav(filename, samples):
    filepath = os.path.join(SOUNDS_DIR, filename)
    with wave.open(filepath, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)   # 16-bit PCM
        wav_file.setframerate(SAMPLE_RATE)
        for sample in samples:
            # Limita a amplitude no range de int16
            val = int(max(-32768, min(32767, sample * 32767)))
            wav_file.writeframesraw(struct.pack('<h', val))
    print(f"Áudio procedural sintetizado com sucesso: {filename}")

# --- PROCEDURAL SOUND GENERATORS ---

def gerar_conclusao_serie():
    # Clique seco agudo e curto (50ms)
    duration = 0.060
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    freq = 1100.0
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Envelope de decaimento exponencial rápido
        envelope = math.exp(-70.0 * t)
        # Senoide pura
        val = math.sin(2.0 * math.pi * freq * t) * envelope
        samples.append(val)
        
    write_wav('conclusao-serie.wav', samples)

def gerar_fim_descanso():
    # Arpejo de 3 notas ascendentes (C5 -> E5 -> G5) em 350ms
    duration = 0.400
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    # Notas e seus tempos em segundos
    # C5 (523Hz), E5 (659Hz), G5 (784Hz)
    notas = [
        (0.00, 0.12, 523.25),
        (0.12, 0.24, 659.25),
        (0.24, 0.40, 783.99)
    ]
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        val = 0.0
        
        for start, end, freq in notas:
            if start <= t < end:
                # Tempo local dentro da nota para decaimento interno
                local_t = t - start
                local_dur = end - start
                envelope = math.sin(math.pi * (local_t / local_dur)) * math.exp(-3.0 * local_t)
                val = math.sin(2.0 * math.pi * freq * local_t) * envelope * 0.7
                break
                
        samples.append(val)
        
    write_wav('fim-descanso.wav', samples)

def gerar_conclusao_exercicio():
    # Acorde harmônico positivo e curto (C5 + G5 + C6) tocados juntos (400ms)
    duration = 0.450
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    freqs = [523.25, 783.99, 1046.50]  # C5, G5, C6
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        envelope = math.exp(-8.0 * t) * math.sin(math.pi * (t / duration))
        
        # Mix de frequências
        val = sum(math.sin(2.0 * math.pi * f * t) for f in freqs) / len(freqs)
        val = val * envelope * 0.8
        samples.append(val)
        
    write_wav('conclusao-exercicio.wav', samples)

def gerar_conclusao_sessao():
    # Jingle alegre curto de vitória ~1.0s (C5 -> E5 -> G5 -> C6 sustentada)
    duration = 1.0
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    notas = [
        (0.00, 0.15, 523.25),
        (0.15, 0.30, 659.25),
        (0.30, 0.45, 783.99),
        (0.45, 1.00, 1046.50)
    ]
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        val = 0.0
        
        for start, end, freq in notas:
            if start <= t < end:
                local_t = t - start
                local_dur = end - start
                
                # Se for a nota final, decai mais suavemente
                if freq == 1046.50:
                    envelope = math.exp(-3.5 * local_t) * 0.7
                else:
                    envelope = math.sin(math.pi * (local_t / local_dur)) * 0.6
                    
                val = math.sin(2.0 * math.pi * freq * local_t) * envelope
                break
                
        samples.append(val)
        
    write_wav('conclusao-sessao.wav', samples)

def gerar_conquista():
    # Som rico e espiritual, estilo tigela tibetana (~1.6s) com tremolo e múltiplas harmônicas
    duration = 1.6
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    # Frequência fundamental de 220Hz (A3) com harmônicos ricos
    freqs = [220.0, 440.0, 660.0, 880.0, 1320.0]
    weights = [1.0, 0.6, 0.4, 0.2, 0.1]
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        
        # Envelope longo de decaimento super suave
        envelope = math.exp(-2.2 * t) * (1.0 - math.exp(-15.0 * t))
        # Tremolo (vibração de volume de 6Hz)
        tremolo = 1.0 + 0.25 * math.sin(2.0 * math.pi * 6.0 * t)
        
        # Mix das harmônicas
        signal = 0.0
        for f, w in zip(freqs, weights):
            signal += math.sin(2.0 * math.pi * f * t) * w
            
        val = (signal / sum(weights)) * envelope * tremolo * 0.85
        samples.append(val)
        
    write_wav('conquista.wav', samples)

def gerar_tier_transicao():
    # Arpejo cintilante, muito rápido ascendente de alta frequência (E6 -> G6 -> B6 -> E7)
    duration = 0.600
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    notas = [
        (0.00, 0.10, 1318.51),  # E6
        (0.10, 0.20, 1567.98),  # G6
        (0.20, 0.30, 1975.53),  # B6
        (0.30, 0.60, 2637.02)   # E7
    ]
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        val = 0.0
        
        for start, end, freq in notas:
            if start <= t < end:
                local_t = t - start
                local_dur = end - start
                
                if freq == 2637.02:
                    envelope = math.exp(-5.0 * local_t) * 0.6
                else:
                    envelope = math.sin(math.pi * (local_t / local_dur)) * 0.5
                    
                # Adiciona vibrato leve de 10Hz na alta frequência
                vibrato = 1.0 + 0.01 * math.sin(2.0 * math.pi * 10.0 * local_t)
                val = math.sin(2.0 * math.pi * freq * vibrato * local_t) * envelope
                break
                
        samples.append(val)
        
    write_wav('tier-transicao.wav', samples)

def gerar_cancelamento():
    # Tom neutro e descendente de 250Hz a 120Hz (250ms)
    duration = 0.300
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        
        # Frequência desliza (glissando) de 250Hz para 130Hz
        freq = 250.0 - (120.0 * (t / duration))
        
        # Envelope de sino suave
        envelope = math.sin(math.pi * (t / duration)) * math.exp(-3.0 * t)
        
        val = math.sin(2.0 * math.pi * freq * t) * envelope * 0.7
        samples.append(val)
        
    write_wav('cancelamento.wav', samples)

def gerar_todos_procedural():
    print("\nIniciando síntese de áudio procedural (salvaguarda)...")
    gerar_conclusao_serie()
    gerar_fim_descanso()
    gerar_conclusao_exercicio()
    gerar_conclusao_sessao()
    gerar_conquista()
    gerar_tier_transicao()
    gerar_cancelamento()
    print("Todas as sínteses procedurais concluídas com sucesso!")

def baixar_ou_gerar():
    garantir_diretorio()
    
    # Tenta baixar os arquivos, se falhar ou der erro, executa a salvaguarda procedural
    # Nota: Em ambientes de build automatizados, conexões externas podem falhar.
    baixou_tudo = True
    print("Tentando baixar efeitos de som a partir da CDN...")
    
    for filename, url in AUDIO_URLS.items():
        filepath = os.path.join(SOUNDS_DIR, filename)
        try:
            print(f"Baixando {filename}...")
            # Configura um timeout curto para evitar esperas intermináveis
            response = urllib.request.urlopen(url, timeout=5)
            with open(filepath, 'wb') as f:
                f.write(response.read())
            print(f"Download concluído: {filename}")
        except Exception as e:
            print(f"Falha ao baixar {filename} ({str(e)}). Ativando salvaguarda procedural.")
            baixou_tudo = False
            break
            
    if not baixou_tudo:
        # Se algum download falhar, gera todos proceduralmente para garantir consistência e perfeição
        gerar_todos_procedural()
    else:
        print("\nTodos os sons foram baixados com sucesso da CDN!")

if __name__ == '__main__':
    baixar_ou_gerar()
