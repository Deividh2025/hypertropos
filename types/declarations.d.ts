/**
 * Declarações de tipos para imports que o TypeScript não resolve nativamente.
 *
 * Por que declarar módulos CSS?
 * O TypeScript puro não entende imports de arquivos .css — eles são processados
 * pelo Metro bundler via NativeWind. Esta declaração diz ao compilador TS
 * que esses imports são válidos (efeito colateral sem valor exportado).
 */

// Permite importar arquivos CSS como side-effects (ex: import '../global.css')
declare module '*.css' {
  const content: unknown
  export default content
}
