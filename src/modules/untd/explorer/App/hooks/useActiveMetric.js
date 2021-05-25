import useStore from '../../store'
import shallow from 'zustand/shallow'

/**
 * Returns the active metric state and a setter function
 */
export default function useActiveMetric() {
  const [activeMetric, setStoreValues] = useStore(
    ({ activeMetric, setStoreValues }) => [
      activeMetric,
      setStoreValues,
    ],
    shallow,
  )
  const setActiveMetric = newMetric =>
    setStoreValues({ activeMetric: newMetric })

  return [activeMetric, setActiveMetric]
}
