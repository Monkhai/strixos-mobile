import { useLayoutEffect, useRef, useState } from 'react'
import { Button, View } from 'react-native'

export function useElementDimensions() {
  const [h, setH] = useState(0)
  const [w, setW] = useState(0)
  const ref = useRef<View>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.measure((_, __, width, height) => {
        setH(height)
        setW(width)
      })
    }
  }, [])

  return { h, w, ref }
}
