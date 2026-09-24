import { useRive, Layout, RuntimeLoader } from '@rive-app/react-canvas'

// Serve the Rive WASM runtime locally instead of the unpkg/jsdelivr defaults.
RuntimeLoader.setWasmUrl('/assets/riv/rive.wasm')
RuntimeLoader.setWasmFallbackUrl('/assets/riv/rive_fallback.wasm')

/**
 * Equivalent of the runtime's `autoBind: true` (bind the artboard's default view model
 * instance plus a default instance of each global view model), but only run when the
 * file actually contains view models. The built-in autoBind path makes the WASM log
 * "Could not find a View Model linked to Artboard ..." for every file without one.
 */
function autoBind(rive, artboardViewModel = true) {
  if (!rive || rive.viewModelCount === 0) return
  // Files whose artboard has no linked view model log "Could not find a View Model linked to
  // Artboard …" from defaultViewModel(); those instances opt out of the artboard step.
  const main = artboardViewModel ? rive.defaultViewModel()?.defaultInstance() : null
  if (main) rive.setViewModelInstance(main)
  for (const name of rive.globalViewModelNames()) {
    const inst = rive.viewModelByName(name)?.defaultInstance()
    if (inst) rive.setGlobalViewModelInstance(name, inst)
  }
  rive.bind()
}

function RiveInner({ src, artboard, fit, alignment, layoutScaleFactor, artboardViewModel }) {
  // CLONE_SPEC 0.6: State Machine 1, autoplay, autoBind, pointer listeners live,
  // isTouchScrollEnabled false, Layout({ fit, alignment, layoutScaleFactor }).
  const { RiveComponent } = useRive({
    src,
    artboard,
    stateMachine: 'State Machine 1',
    autoplay: true,
    autoBind: false,
    onRiveReady: (rive) => autoBind(rive, artboardViewModel),
    shouldDisableRiveListeners: false,
    isTouchScrollEnabled: false,
    layout: new Layout({ fit, alignment, layoutScaleFactor }),
  })
  return <RiveComponent style={{ width: '100%', height: '100%' }} />
}

/**
 * Fills its parent (width/height 100%). Remounts when the layout changes so a
 * breakpoint-specific fit/alignment/scale is applied from a clean instance.
 */
export default function RiveCanvas({ src, artboard, fit, alignment, layoutScaleFactor = 1, artboardViewModel = true }) {
  return (
    <RiveInner
      key={`${fit}|${alignment}|${layoutScaleFactor}`}
      src={src}
      artboard={artboard}
      fit={fit}
      alignment={alignment}
      layoutScaleFactor={layoutScaleFactor}
      artboardViewModel={artboardViewModel}
    />
  )
}
