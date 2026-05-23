/**
 * babel.config.js — Configuração do transpilador Babel para o projeto Hypertropos
 *
 * Por que jsxImportSource: "nativewind"?
 * O NativeWind v4 usa uma abordagem de "CSS Interop" onde o JSX é transformado
 * para aplicar estilos nativos. O jsxImportSource redireciona as importações
 * JSX automáticas para o runtime do NativeWind, habilitando className nas views.
 *
 * Por que module-resolver?
 * O tsconfig.json resolve os path aliases (@/components, etc.) apenas para o
 * TypeScript. Em runtime, o Babel precisa do module-resolver para que os imports
 * @/... sejam resolvidos corretamente pelo Metro bundler.
 */
module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // Redireciona JSX para o runtime do NativeWind para suporte a className
          jsxImportSource: 'nativewind',
        },
      ],
      'nativewind/babel',
    ],
    plugins: [
      [

        // Resolve os path aliases (@/components, @/lib, etc.) em runtime
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@/components': './components',
            '@/lib': './lib',
            '@/db': './db',
            '@/hooks': './hooks',
            '@/stores': './stores',
            '@/types': './types',
            '@/constants': './constants',
            '@/assets': './assets',
          },
        },
      ],
    ],
  }
}
