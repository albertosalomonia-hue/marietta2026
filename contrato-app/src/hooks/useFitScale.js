import { useEffect, useState } from 'react'

// Calcula el factor de escala necesario para que el contenido (una hoja A4 de ancho fijo)
// quepa dentro del ancho disponible del contenedor, sin agrandarlo (máximo 1).
export function useFitScale(containerRef, contentRef, targetSelector = '.pdf-page--sheet') {
  const [scale, setScale] = useState(1)
  const [naturalHeight, setNaturalHeight] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const recalc = () => {
      const target = content.querySelector(targetSelector)
      if (!target) return
      // getComputedStyle().width no se ve afectado por un transform:scale ya aplicado,
      // así que sirve como medida estable del ancho "natural" de la hoja.
      const naturalWidth = parseFloat(getComputedStyle(target).width) || target.offsetWidth
      const containerWidth = container.clientWidth
      const nextScale = naturalWidth > 0 ? Math.min(1, containerWidth / naturalWidth) : 1
      setScale(nextScale)
      setNaturalHeight(content.scrollHeight)
    }

    recalc()
    const resizeObserver = new ResizeObserver(recalc)
    resizeObserver.observe(container)
    const mutationObserver = new MutationObserver(recalc)
    mutationObserver.observe(content, { childList: true, subtree: true, characterData: true })
    window.addEventListener('resize', recalc)

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', recalc)
    }
  }, [containerRef, contentRef, targetSelector])

  return { scale, naturalHeight }
}
