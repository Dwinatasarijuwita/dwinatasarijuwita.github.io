import AboutApp from '../apps/AboutApp'
import ContactApp from '../apps/ContactApp'
import MusicApp from '../apps/MusicApp'
import PhotosApp from '../apps/PhotosApp'
import ResumeApp from '../apps/ResumeApp'
import { profile } from './profile'

export const apps = [
  {
    id: 'about',
    placement: 'dock',
    title: 'About Me',
    Component: AboutApp,
    size: { width: 540, height: 420 },
    initialPosition: { x: 120, y: 48 },
  },
  {
    id: 'resume',
    placement: 'desktop',
    kind: 'file',
    desktopLabel: profile.resume.downloadName,
    title: 'Resume',
    Component: ResumeApp,
    size: { width: 720, height: 560 },
    initialPosition: { x: 220, y: 32 },
  },
  {
    id: 'contact',
    placement: 'dock',
    title: 'Contact',
    Component: ContactApp,
    size: { width: 400, height: 420 },
    initialPosition: { x: 320, y: 96 },
  },
  {
    id: 'music',
    placement: 'dock',
    title: 'Music Favorite',
    Component: MusicApp,
    size: { width: 460, height: 520 },
    initialPosition: { x: 420, y: 64 },
  },
  {
    id: 'photos',
    placement: 'dock',
    title: 'Photos',
    Component: PhotosApp,
    size: { width: 860, height: 620 },
    initialPosition: { x: 180, y: 40 },
  },
  {
    id: 'github',
    placement: 'dock',
    kind: 'link',
    title: 'GitHub',
    url: profile.github,
  },
]
