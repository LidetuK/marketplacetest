import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => ({
  theme: 'base',
  themeVariables: {
    primaryColor: '#d9efec',
    primaryTextColor: '#0f172a',
    primaryBorderColor: '#0f766e',
    lineColor: '#475569',
    secondaryColor: '#f8fafc',
    tertiaryColor: '#ffffff',
    fontFamily: 'Plus Jakarta Sans, Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '15px',
  },
  flowchart: {
    curve: 'basis',
    padding: 18,
    nodeSpacing: 50,
    rankSpacing: 50,
    wrappingWidth: 220,
    htmlLabels: true,
  },
}))
