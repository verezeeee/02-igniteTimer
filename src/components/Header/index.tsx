import { HeaderContainer } from './styles'
import { useTheme } from 'styled-components'
import { Alien, Timer, Scroll } from 'phosphor-react'
import { NavLink } from 'react-router-dom'

export function Header() {
  const theme = useTheme()
  return (
    <HeaderContainer>
      <span>
        <Alien size={50} weight="thin" color={theme['green-500']} />
      </span>
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
