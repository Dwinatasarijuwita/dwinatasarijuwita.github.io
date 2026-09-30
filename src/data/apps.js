import AboutApp from '../apps/AboutApp'
import ContactApp from '../apps/ContactApp'
import MusicApp from '../apps/MusicApp'
import ResumeApp from '../apps/ResumeApp'

export const apps = [
  {
    id: 'about',
    title: 'About Me',
    Component: AboutApp,
    size: { width: 540, height: 420 },
    initialPosition: { x: 120, y: 48 },
  },
  {
    id: 'resume',
    title: 'Resume',
    Component: ResumeApp,
    size: { width: 720, height: 560 },
    initialPosition: { x: 220, y: 32 },
  },
  {
    id: 'contact',
    title: 'Contact',
    Component: ContactApp,
    size: { width: 400, height: 420 },
    initialPosition: { x: 320, y: 96 },
  },
  {
    id: 'music',
    title: 'Music Favorite',
    Component: MusicApp,
    size: { width: 460, height: 520 },
    initialPosition: { x: 420, y: 64 },
  },
]
