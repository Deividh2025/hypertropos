import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { useTheme } from '../../hooks/useTheme';
import { MagnifyingGlass, BookOpen, CheckCircle, GraduationCap } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { listarArtigos, obterArtigosLidos } from '../../db/queries/artigos';
import { obterPerfil } from '../../db/queries/perfil';
import { ordenarArtigosPorPerfil } from '../../lib/personalizacao-conteudo';
import { ArtigoCientifico } from '../../types/artigo';
import { Perfil } from '../../types/perfil';
import { SkeletonArtigos } from '../../components/ui/Skeletons';


export default function CienciaScreen() {
  const { tokens } = useTheme();
  const router = useRouter();

  // Estados
  const [artigos, setArtigos] = useState<ArtigoCientifico[]>([]);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [artigosLidos, setArtigosLidos] = useState<string[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Carrega os dados na abertura
  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      try {
        const [listaArtigos, dadosPerfil, lidosIds] = await Promise.all([
          listarArtigos(),
          obterPerfil(),
          obterArtigosLidos()
        ]);
        
        setPerfil(dadosPerfil);
        setArtigosLidos(lidosIds);
        
        // Ordena com base nas preferências do perfil
        const ordenados = ordenarArtigosPorPerfil(listaArtigos, dadosPerfil);
        setArtigos(ordenados);
      } catch (error) {
        console.error('Erro ao carregar dados na aba Ciência:', error);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // Recarrega os lidos quando a tela ganha foco (caso o usuário tenha acabado de ler um artigo)
  // Como estamos no Expo Router, podemos usar hooks simples de ciclo de vida ou um timer sutil
  useEffect(() => {
    const interval = setInterval(async () => {
      const lidosIds = await obterArtigosLidos();
      setArtigosLidos(lidosIds);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Filtra artigos pela barra de pesquisa
  const artigosFiltrados = artigos.filter(art => {
    const query = busca.toLowerCase();
    const tituloMatch = art.titulo.toLowerCase().includes(query);
    const tagsMatch = art.tags.some(tag => tag.toLowerCase().includes(query));
    return tituloMatch || tagsMatch;
  });

  const handlePressCard = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/artigo/${id}` as any);
  };

  const renderArtigoCard = ({ item }: { item: ArtigoCientifico }) => {
    const lido = artigosLidos.includes(item.id);
    // Verifica se este artigo é recomendado para o perfil do usuário (possui tags que dão match)
    const tagsInteresse: string[] = [];
    if (perfil) {
      if (perfil.usa_creatina) tagsInteresse.push('usa_creatina');
      if (perfil.usa_cafeina) tagsInteresse.push('usa_cafeina');
      // Adicionar mais matches se necessário
    }
    const recomendado = item.tags_perfil_relacionadas.some(tag => tagsInteresse.includes(tag)) || 
                        (perfil?.nivel === 'iniciante' && item.tags_perfil_relacionadas.includes('retorno_ao_treino'));

    return (
      <Pressable
        onPress={() => handlePressCard(item.id)}
        className="mb-4 bg-bg-elevated border border-border-subtle rounded-md p-4 flex-row items-start justify-between active:scale-[0.98] transition-transform"
        style={{ minHeight: 110 }}
      >
        <View className="flex-1 pr-3 gap-2">
          {recomendado && (
            <View className="bg-accent-bronze/15 self-start px-2 py-0.5 rounded-xs border border-accent-bronze/30">
              <Texto variant="captionBold" color="bronze" className="text-[10px] uppercase tracking-wider">
                Recomendado para você
              </Texto>
            </View>
          )}
          
          <Texto variant="h3" color="primary" className="leading-snug font-display">
            {item.titulo}
          </Texto>
          
          <View className="flex-row flex-wrap gap-1.5 mt-1">
            {item.tags.slice(0, 3).map(tag => (
              <View key={tag} className="bg-bg-highlight/30 px-2 py-0.5 rounded-xs">
                <Texto variant="caption" color="secondary" className="text-[11px] font-medium">
                  #{tag.replace('_', ' ')}
                </Texto>
              </View>
            ))}
          </View>

          <Texto variant="caption" color="muted" className="mt-1 font-medium">
            {item.tempo_leitura_min} min de leitura
          </Texto>
        </View>

        <View className="justify-center items-center h-full pt-4">
          {lido ? (
            <CheckCircle size={26} color={tokens.feedback.success} weight="fill" />
          ) : (
            <BookOpen size={24} color={tokens.fg.muted} weight="light" />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <Container className="px-6 pt-4">
      {/* Header */}
      <View className="mb-6 flex-row justify-between items-center">
        <View className="gap-1">
          <Texto variant="displayL" className="font-display">Ciência</Texto>
          <Texto variant="body" color="muted">Por trás da musculação científica</Texto>
        </View>
        <GraduationCap size={36} color={tokens.accent.bronze} weight="light" />
      </View>

      {/* Busca */}
      <View 
        className="flex-row items-center bg-bg-elevated border border-border-subtle rounded-md px-4 mb-6"
        style={{ height: 50 }}
      >
        <MagnifyingGlass size={20} color={tokens.fg.muted} />
        <TextInput
          placeholder="Buscar artigos por título ou tag..."
          placeholderTextColor={tokens.fg.muted}
          value={busca}
          onChangeText={setBusca}
          className="flex-1 ml-3 font-body text-fg-primary text-[15px] h-full"
          selectionColor={tokens.accent.bronze}
        />
      </View>

      {/* Lista de Artigos */}
      {carregando ? (
        <SkeletonArtigos />
      ) : (
        <FlatList

          data={artigosFiltrados}
          keyExtractor={item => item.id}
          renderItem={renderArtigoCard}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="py-12 items-center justify-center gap-2">
              <Texto variant="h3" color="secondary" className="text-center">Nenhum artigo encontrado</Texto>
              <Texto variant="body" color="muted" className="text-center max-w-[240px]">
                Tente buscar por termos mais genéricos ou outras palavras-chave.
              </Texto>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </Container>
  );
}
