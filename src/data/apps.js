import AboutApp from '../apps/AboutApp'
import ContactApp from '../apps/ContactApp'
import ExperienceApp from '../apps/ExperienceApp'
import MusicApp from '../apps/MusicApp'
import PhotosApp from '../apps/PhotosApp'
import ProjectsApp from '../apps/ProjectsApp'
import ResumeApp from '../apps/ResumeApp'
import SettingsApp from '../apps/SettingsApp'
import TrashApp from '../apps/TrashApp'
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
    fileType: 'pdf',
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
    id: 'projects',
    placement: 'dock',
    title: 'Projects',
    Component: ProjectsApp,
    size: { width: 760, height: 560 },
    initialPosition: { x: 200, y: 44 },
  },
  {
    id: 'experience',
    placement: 'desktop',
    kind: 'file',
    fileType: 'doc',
    desktopLabel: 'Work Experience',
    title: 'Experience',
    Component: ExperienceApp,
    size: { width: 560, height: 520 },
    initialPosition: { x: 260, y: 56 },
  },
  {
    id: 'github',
    placement: 'dock',
    kind: 'link',
    title: 'GitHub',
    url: profile.github,
  },
  {
    id: 'linkedin',
    placement: 'dock',
    kind: 'link',
    title: 'LinkedIn',
    url: profile.linkedin,
  },
  {
    id: 'instagram',
    placement: 'dock',
    kind: 'link',
    title: 'Instagram',
    url: profile.instagram,
  },
  {
    id: 'settings',
    placement: 'dock',
    title: 'Settings',
    Component: SettingsApp,
    size: { width: 560, height: 360 },
    initialPosition: { x: 280, y: 80 },
  },
  // Like on a Mac, Trash sits at the far end of the Dock, after a divider.
  {
    id: 'trash',
    placement: 'dock',
    dockGroup: 'end',
    title: 'Trash',
    Component: TrashApp,
    size: { width: 720, height: 480 },
    initialPosition: { x: 240, y: 60 },
  },
]
