import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const endpoint = id ? `${API_URL}/musics/${id}` : `${API_URL}/musics`

  try {
    const res = await fetch(endpoint)

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Erro ao buscar músicas' },
        { status: res.status },
      )
    }

    const data: unknown = await res.json()
    return NextResponse.json(data)
  } catch (_err) {
    return NextResponse.json(
      { error: 'Backend indisponível' },
      { status: 503 },
    )
  }
}