import { Fragment } from 'react'
import Avatar from '../components/Avatar'
import { profile } from '../data/profile'

export default function AboutApp() {
  return (
    <div className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-start sm:text-left">
      <Avatar size="lg" />
      <div className="min-w-0 space-y-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.tagline}</p>
        </div>
        {profile.intro.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-gray-700">
            {paragraph}
          </p>
        ))}
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left text-sm">
          {profile.facts.map((fact) => (
            <Fragment key={fact.label}>
              <dt className="font-medium text-gray-900">{fact.label}</dt>
              <dd className="text-gray-600">{fact.value}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </div>
  )
}
