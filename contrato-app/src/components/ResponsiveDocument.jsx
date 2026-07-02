import { useRef } from 'react'
import { useFitScale } from '../hooks/useFitScale'

// Envuelve el documento (hojas A4 de ancho fijo) y lo escala visualmente para que quepa
// en pantallas angostas (celulares), sin tocar el DOM real que usan la impresión y la
// exportación a PDF (que siempre trabajan a resolución completa, ver index.css).
export default function ResponsiveDocument({ children }) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const { scale, naturalHeight } = useFitScale(containerRef, contentRef)

  return (
    <div
      ref={containerRef}
      className="responsive-doc-container"
      style={scale < 1 ? { height: naturalHeight * scale } : undefined}
    >
      <div ref={contentRef} className="responsive-doc-content" style={scale < 1 ? { transform: `scale(${scale})` } : undefined}>
        {children}
      </div>
    </div>
  )
}
