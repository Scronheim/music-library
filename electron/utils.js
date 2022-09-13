import fs from 'fs'
import walk from 'walk'
import Mp3 from 'mp3tag.js'
import Store from 'electron-store'
import slugify from 'slugify'

const store = new Store()

const SONG_TITLE_TAG = 'TIT2'
const ARTIST_TITLE_TAG = 'TPE1'
const ALBUM_TITLE_TAG = 'TALB'
const YEAR_TAG = 'TDRC'
const GENRE_TAG = 'TCON'
const ADDITIONAL_TAGS = 'TXXX'
const TRACK_NUMBER_TAG = 'TRCK'
const ART_TAG = 'APIC'

const slugOptions = {
  replacement: '_',
  lower: true,
  trim: true,
}

export function parseArtistFolder(artistFolderPath) {
  return new Promise((resolve, reject) => {
    const mp3paths = []
    const walker = walk.walk(artistFolderPath.filePaths[0])

    walker.on('file', (root, file, next) => {
      if (file.name.endsWith('.mp3')) {
        mp3paths.push(`${root}/${file.name}`)
      }
      next()
    })
    walker.on('end', () => {
      for (const pathToMp3 of mp3paths) {
        const meta = new Mp3(fs.readFileSync(pathToMp3), false)
        meta.read()
        let artists = store.get('artists', [])
        // console.log(meta.tags.v2)
        const artistTitle = toTitleCase(meta.tags.v2[ARTIST_TITLE_TAG])
        const artistCountry = meta.tags.v2[ADDITIONAL_TAGS]?.find(tag => tag.description === 'RELEASECOUNTRY')?.text || ''
        const albumTitle = toTitleCase(meta.tags.v2[ALBUM_TITLE_TAG])
        const albumYear = parseInt(meta.tags.v2[YEAR_TAG]) || undefined
        const trackTitle = toTitleCase(meta.tags.v2[SONG_TITLE_TAG])
        const trackGenre = toTitleCase(meta.tags.v2[GENRE_TAG])
        const trackNumber = parseInt(meta.tags.v2[TRACK_NUMBER_TAG]) || undefined
        let artist = artists.find(a => a.artist === artistTitle)

        if (!artist) {
          artist = {
            artist: artistTitle,
            slug: slugify(artistTitle, slugOptions),
            albums: [{
              title: albumTitle,
              slug: slugify(albumTitle, slugOptions),
              year: albumYear,
              pic: '',
              tracks: [{
                title: trackTitle,
                number: trackNumber,
                genre: trackGenre,
                path: pathToMp3,
              }],
            }],
            genres: [trackGenre],
            country: artistCountry,
            pic: '',
          }
          artists.push(artist)
        } else {
          let album = artist.albums.find(a => a.title === albumTitle)
          if (album) {
            let track = album.tracks.find(t => t.title === trackTitle)
            if (!track) {
              album.tracks.push({
                title: trackTitle,
                number: trackNumber,
                genre: trackGenre,
                path: pathToMp3,
              })
            }
          } else {
            artist.albums.push({
              title: albumTitle,
              slug: slugify(albumTitle, slugOptions),
              year: albumYear,
              genre: trackGenre,
              pic: '',
              tracks: [{
                title: trackTitle,
                number: trackNumber,
                genre: trackGenre,
                path: pathToMp3,
              }]
            })
          }
        }
        artist.albums.map((a) => {
          a.tracks.sort((a, b) => a.number - b.number)
        })
        artist.albums.sort((a, b) => a.year - b.year)
        store.set('artists', artists)
      }
      resolve()
    })
  })
}

const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
