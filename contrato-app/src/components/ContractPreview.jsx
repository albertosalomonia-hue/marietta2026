import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { buildContractBlocks, HeaderBlock } from './contractBlocks'

const SAFETY_BUFFER_PX = 56

function paginateByHeight(heights, budget) {
  const pages = []
  let current = []
  let used = 0
  heights.forEach((h, i) => {
    if (current.length > 0 && used + h > budget) {
      pages.push(current)
      current = []
      used = 0
    }
    current.push(i)
    used += h
  })
  if (current.length) pages.push(current)
  return pages.length ? pages : [[]]
}

const ContractPreview = forwardRef(function ContractPreview({ data }, ref) {
  const blocks = useMemo(() => buildContractBlocks(data), [data])
  const [pages, setPages] = useState(null)

  const measureFrameRef = useRef(null)
  const headerMeasureRef = useRef(null)
  const itemRefs = useRef([])

  useLayoutEffect(() => {
    const frame = measureFrameRef.current
    const headerEl = headerMeasureRef.current
    if (!frame || !headerEl) return

    const frameRect = frame.getBoundingClientRect()
    const cs = getComputedStyle(frame)
    const availableHeight = frameRect.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
    const headerHeight = headerEl.getBoundingClientRect().height
    const budget = Math.max(100, availableHeight - headerHeight - SAFETY_BUFFER_PX)

    const heights = itemRefs.current.map((el) => (el ? el.getBoundingClientRect().height : 0))
    setPages(paginateByHeight(heights, budget))
  }, [blocks])

  const totalPages = pages?.length || 1
  const visiblePages = pages ?? [blocks.map((_, i) => i)]

  return (
    <div ref={ref} className="print-area">
      {/* Capa de medición oculta: usa el mismo tamaño/relleno de hoja para calcular saltos de página reales */}
      <div
        ref={measureFrameRef}
        className="pdf-page"
        style={{ position: 'absolute', top: 0, left: -99999, height: '297mm', visibility: 'hidden', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {/* display: flow-root evita que el margin-bottom de cada bloque "colapse" fuera del div
            medido (lo cual haría que getBoundingClientRect() ignore ese margen y subestime el alto real) */}
        <div ref={headerMeasureRef} style={{ display: 'flow-root' }}>
          <HeaderBlock pageNumber={1} totalPages={1} />
        </div>
        {blocks.map((b, i) => (
          <div key={b.key} ref={(el) => (itemRefs.current[i] = el)} style={{ display: 'flow-root' }}>
            {b.node}
          </div>
        ))}
      </div>

      {/* Hojas visibles, ya paginadas */}
      {visiblePages.map((indices, pageIdx) => (
        <div key={pageIdx} className="pdf-page pdf-page--sheet">
          <HeaderBlock pageNumber={pageIdx + 1} totalPages={totalPages} />
          {indices.map((i) => (
            <div key={blocks[i].key}>{blocks[i].node}</div>
          ))}
        </div>
      ))}
    </div>
  )
})

export default ContractPreview
