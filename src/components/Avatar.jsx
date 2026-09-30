import { profile } from '../data/profile'
import { profilePhotoUrl } from '../lib/profilePhoto'

const SIZES = {
  xs: 'size-5 text-[8px]',
  sm: 'size-10 text-sm',
  md: 'size-16 text-xl',
  lg: 'size-24 text-3xl',
}

export default function Avatar({ size = 'md' }) {
  const label = `Avatar ${profile.name}`

  if (profilePhotoUrl) {
    return (
      <span className={`${SIZES[size]} block shrink-0 overflow-hidden rounded-full shadow-inner`}>
        <img
          src={profilePhotoUrl}
          alt={label}
          className="size-full origin-[50%_45%] scale-[1.4] object-cover object-[50%_45%]"
        />
      </span>
    )
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-400 via-fuchsia-500 to-indigo-500 font-semibold text-white shadow-inner`}
    >
      {profile.initials}
    </div>
  )
}
