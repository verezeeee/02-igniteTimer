import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  TaskInput,
} from './styles'
import { useEffect, useState } from 'react'

const newCycleSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa!'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
}

type NewCycleFormData = zod.infer<typeof newCycleSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPast, setAmountSecondsPast] = useState(0)
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })
  
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPast(differenceInSeconds(new Date(), activeCycle.startDate))
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      ...data,
      startDate: new Date()
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPast(0)

    reset()
  }


  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPast : 0

  const minutes = Math.floor(currentSeconds / 60)
  const seconds = currentSeconds % 60

  const minutesString = String(minutes).padStart(2, '0')
  const secondsString = String(seconds).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `Ignite Timer - ${minutesString}:${secondsString}`
    }
  }, [minutes, seconds, activeCycle])

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            list="tasks"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />
          <datalist id="tasks">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', {
              valueAsNumber: true,
            })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutesString[0]}</span>
          <span>{minutesString[1]}</span>
          <Separator>:</Separator>
          <span>{secondsString[0]}</span>
          <span>{secondsString[1]}</span>
        </CountdownContainer>

        <StartCountDownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountDownButton>
      </form>
    </HomeContainer>
  )
}
