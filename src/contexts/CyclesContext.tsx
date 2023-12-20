import {
  ReactNode,
  createContext,
  useState,
  useReducer,
  useEffect,
} from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'
interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextData {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPast: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  CreateNewCycle: (data: CreateCycleData) => void
  InterruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextData)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,

    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const stateJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')
      if (stateJSON) {
        return JSON.parse(stateJSON)
      }
    },
  )
  const { cycles, activeCycleId } = cyclesState
  const [amountSecondsPast, setAmountSecondsPast] = useState(() => {
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    if (activeCycle) {
      const secondsDifference = differenceInSeconds(
        new Date(),
        new Date(activeCycle.startDate),
      )

      return secondsDifference
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPast(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }
  function CreateNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      ...data,
      startDate: new Date(),
    }
    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPast(0)
  }

  function InterruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }
  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPast,
        setSecondsPassed,
        CreateNewCycle,
        InterruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
