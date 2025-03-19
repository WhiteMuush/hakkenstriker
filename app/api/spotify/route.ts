import { NextResponse } from "next/server"

// Fonction pour obtenir un token d'accès Spotify
async function getAccessToken() {
  const clientId = "f17f245cbbf34712a0f48fef0180de21"
  const clientSecret = "862507b96c184a06bfd8d5eafb6ef5e4"

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  })

  const data = await response.json()
  return data.access_token
}

// Fonction pour obtenir les pistes d'un album
async function getAlbumTracks(albumId: string, accessToken: string) {
  const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=10`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json()
  return data.items
}

// Fonction pour obtenir les détails d'une piste
async function getTrackDetails(trackId: string, accessToken: string) {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return await response.json()
}

// Fonction pour obtenir les dernières sorties d'un artiste avec les pistes
async function getArtistReleases(artistId: string) {
  const accessToken = await getAccessToken()

  // Récupérer les albums de l'artiste
  const albumsResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=3`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  const albumsData = await albumsResponse.json()

  // Pour chaque album, récupérer les pistes
  const releases = await Promise.all(
    albumsData.items.map(async (album: any) => {
      const tracks = await getAlbumTracks(album.id, accessToken)

      // Récupérer les détails des pistes pour obtenir les previews
      const tracksWithDetails = await Promise.all(
        tracks.map(async (track: any) => {
          const trackDetails = await getTrackDetails(track.id, accessToken)
          return {
            id: track.id,
            name: track.name,
            duration_ms: track.duration_ms,
            preview_url: trackDetails.preview_url,
            track_number: track.track_number,
          }
        }),
      )

      return {
        id: album.id,
        title: album.name,
        year: new Date(album.release_date).getFullYear().toString(),
        image: album.images[0]?.url || "/placeholder.svg?height=500&width=500",
        spotifyUrl: album.external_urls.spotify,
        tracks: tracksWithDetails.filter((track) => track.preview_url),
      }
    }),
  )

  return releases
}

export async function GET() {
  try {
    // Votre ID d'artiste Spotify
    const artistId = "3MfxSldgvVispErMvgpqUo"

    const releases = await getArtistReleases(artistId)

    return NextResponse.json({ releases })
  } catch (error) {
    console.error("Erreur lors de la récupération des morceaux Spotify:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des morceaux Spotify",
        releases: [
          {
            id: "fallback1",
            title: "Industrial Chaos",
            year: "2023",
            image: "/placeholder.svg?height=500&width=500",
            spotifyUrl: "#",
            tracks: [
              { id: "t1", name: "Track 1", duration_ms: 180000, preview_url: null, track_number: 1 },
              { id: "t2", name: "Track 2", duration_ms: 210000, preview_url: null, track_number: 2 },
            ],
          },
          {
            id: "fallback2",
            title: "Raw Energy EP",
            year: "2022",
            image: "/placeholder.svg?height=500&width=500",
            spotifyUrl: "#",
            tracks: [
              { id: "t3", name: "Track 3", duration_ms: 195000, preview_url: null, track_number: 1 },
              { id: "t4", name: "Track 4", duration_ms: 225000, preview_url: null, track_number: 2 },
            ],
          },
          {
            id: "fallback3",
            title: "Smash Hard",
            year: "2021",
            image: "/placeholder.svg?height=500&width=500",
            spotifyUrl: "#",
            tracks: [
              { id: "t5", name: "Track 5", duration_ms: 185000, preview_url: null, track_number: 1 },
              { id: "t6", name: "Track 6", duration_ms: 215000, preview_url: null, track_number: 2 },
            ],
          },
        ],
      },
      { status: 500 },
    )
  }
}

