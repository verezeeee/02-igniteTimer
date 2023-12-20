import { differenceInSeconds } from 'date-fns'
import { CountdownContainer, Separator } from './styles'
import { useEffect, useContext } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPast,
    setSecondsPassed: setAmountSecondsPast,
  } = useContext(CyclesContext)

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
  }, [minutes, seconds, activeCycle, minutesString, secondsString])
  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setAmountSecondsPast(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPast(secondsDifference)
        }
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setAmountSecondsPast,
  ])
  return (
    <CountdownContainer>
      <span>{minutesString[0]}</span>
      <span>{minutesString[1]}</span>
      <Separator>:</Separator>
      <span>{secondsString[0]}</span>
      <span>{secondsString[1]}</span>
    </CountdownContainer>
  )
}
