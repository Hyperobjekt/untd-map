import { useEffect } from 'react'
import shallow from 'zustand/shallow'
import useStore from '../store'

export default function useTourAnalytics() {
  const [tourStepIndex, runTour] = useStore(
    state => [state.tourStepIndex, state.runTour],
    shallow,
  )

  useEffect(() => {
    console.log('tourStepIndex', tourStepIndex)
  }, [tourStepIndex])

  useEffect(() => {
    console.log('runTour', runTour)
  }, [runTour])
}
