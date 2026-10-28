import Desktop from '../../components/desktop/Desktop'
import HomeScreen from '../../components/mobile/HomeScreen'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function Home() {
  return useIsMobile() ? <HomeScreen /> : <Desktop />
}
