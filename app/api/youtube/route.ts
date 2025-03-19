import { NextResponse } from "next/server"

// YouTube API key approach (simpler than OAuth for this use case)
// Remplacer cette ligne:
// const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

// Par votre clé d'API réelle (temporairement pour les tests):
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ""

// OU si vous préférez continuer à utiliser une variable d'environnement (recommandé),
// gardez la ligne originale mais assurez-vous de configurer la variable d'environnement
const CHANNEL_ID = "UCS90yEmCDHOeEBzfomnBu5A"

export async function GET() {
  try {
    // Fetch the latest video from the channel
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=1&order=date&type=video&key=${YOUTUBE_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch YouTube data")
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "No videos found" }, { status: 404 })
    }

    const latestVideo = data.items[0]
    const videoId = latestVideo.id.videoId
    const videoTitle = latestVideo.snippet.title
    const thumbnailUrl = latestVideo.snippet.thumbnails.high.url

    return NextResponse.json({
      videoId,
      videoTitle,
      thumbnailUrl,
    })
  } catch (error) {
    console.error("YouTube API error:", error)
    return NextResponse.json({ error: "Failed to fetch YouTube data" }, { status: 500 })
  }
}

