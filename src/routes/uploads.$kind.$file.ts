import { createFileRoute } from '@tanstack/react-router'
import { readUploadedImage } from '../server/uploads.server'

export const Route = createFileRoute('/uploads/$kind/$file')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const file = readUploadedImage(params.kind, params.file)
        if (!file) return new Response('Not found', { status: 404 })
        return new Response(new Uint8Array(file.body), {
          headers: {
            'Content-Type': file.type,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      },
    },
  },
})
