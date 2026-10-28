// Genre names follow the user's own list; the Featured title's reason is theirs, polished into English.
// Each `poster` is a TMDB image id; `tone` is the [background, lettering] pair for the type-only
// poster shown while the image loads or if it fails.
export const favoriteGenres = ['Medical TV', 'Horror', 'Mystery', 'Thriller', 'Comedies']

export const featured = {
  id: 'hospital-playlist',
  poster: '8MSjQkH2FrG0t4l84L5HmiSFrS7',
  tone: ['#0f3b3a', '#f4d9a6'],
  title: 'Hospital Playlist',
  year: 2020,
  genres: ['Korean', 'Dramas', 'Medical TV'],
  why: "A great story that stays easygoing, with no conflict that gets too heavy, so it's the kind of show you can put on purely to heal. It really captures the world of medicine and the friendships inside it.",
}

export const movies = [
  { id: 'trauma-code', poster: 'y8h2RwUZM5chv9tuaKVwSPoo3KE', tone: ['#5a0f14', '#ffe4d6'], title: 'The Trauma Code: Heroes on Call', year: 2025, genres: ['Dramas', 'Korean', 'Social Issue', 'Medical TV'] },
  { id: 'resident-playbook', poster: 'bB5Tu1Rzq6guKsMhV59aszN9c0a', tone: ['#efe3cc', '#1d3557'], title: 'Resident Playbook', year: 2025, genres: ['Comedies', 'Korean', 'Dramas', 'Medical TV'] },
  { id: 'mystic-pop-up-bar', poster: 'ol3UYd3EfHmz5jz777jpAPwGxwp', tone: ['#1b1040', '#f7c948'], title: 'Mystic Pop-up Bar', year: 2020, genres: ['Dramas', 'Korean', 'Fantasy'] },
  { id: 'all-of-us-are-dead', poster: 'pTEFqAjLd5YTsMD6NSUxV6Dq7A6', tone: ['#33401a', '#e3ecbf'], title: 'All of Us Are Dead', year: 2022, genres: ['Dramas', 'Korean', 'Horror', 'Teen'] },
  { id: 'my-demon', poster: 'xBnscv5BrJREKVSvh0le61y4KDk', tone: ['#140c0c', '#ef4351'], title: 'My Demon', year: 2023, genres: ['Korean', 'Comedies', 'Romantic TV'] },
  { id: 'fight-for-my-way', poster: '55w33JzFKBkz1evjBjqeF0enDd1', tone: ['#ff6b35', '#1a1a1a'], title: 'Fight for My Way', year: 2017, genres: ['Korean', 'Comedies', 'Romantic TV', 'Sports'] },
  { id: '5cm', poster: 'y43O9tj6yo4h1shx58YGBsbjme4', tone: ['#1e4d7b', '#ffffff'], title: '5 cm', year: 2012, genres: ['Indonesian', 'Dramas'] },
]

// Favourite genres come first, in the user's order; the rest follow by how many titles they hold.
// Genres with no titles yet are skipped so no row is empty.
export function genreRows(titles = [featured, ...movies]) {
  const counts = new Map()
  for (const title of titles) for (const genre of title.genres) counts.set(genre, (counts.get(genre) ?? 0) + 1)
  const others = [...counts.keys()].filter((genre) => !favoriteGenres.includes(genre)).sort((a, b) => counts.get(b) - counts.get(a))
  return [...favoriteGenres.filter((genre) => counts.has(genre)), ...others].map((genre) => ({
    genre,
    titles: titles.filter((title) => title.genres.includes(genre)),
  }))
}

export function posterUrl(title, width = 342) {
  return `https://image.tmdb.org/t/p/w${width}/${title.poster}.jpg`
}
