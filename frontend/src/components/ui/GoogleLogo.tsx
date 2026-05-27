/**
 * Logo oficial do Google carregado diretamente do CDN do Google.
 * Usar em botões de "Entrar com Google".
 */
export function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt="Logo Google"
      width={size}
      height={size}
      style={{ display: 'block', flexShrink: 0 }}
    />
  )
}
