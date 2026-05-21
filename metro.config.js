/**
 * metro.config.js — Configuração do bundler Metro para o projeto Hypertropos
 *
 * Por que withNativeWind?
 * O NativeWind v4 precisa que o Metro processe o global.css em tempo de build
 * para gerar os estilos compilados. O wrapper withNativeWind adiciona um
 * transformer customizado ao Metro que compila o Tailwind CSS durante o bundle.
 *
 * Por que input: './global.css'?
 * É o ponto de entrada do compilador CSS — onde as diretivas @tailwind estão.
 */
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, {
  // Arquivo CSS de entrada para o compilador Tailwind
  input: './global.css',
})
