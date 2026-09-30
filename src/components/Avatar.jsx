import { profile } from '../data/profile'

const SIZES = {
  sm: 'size-10 text-sm',
  md: 'size-16 text-xl',
  lg: 'size-24 text-3xl',
}

export default function Avatar({ size = 'md' }) {
  return (
    <div
      role="img"
      aria-label={`Avatar ${profile.name}`}
      className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-400 via-fuchsia-500 to-indigo-500 font-semibold text-white shadow-inner`}
    >
      {profile.initials}
    </div>
  )
}
