import { NextApiRequest } from 'next'

export default async function getToken(req: NextApiRequest) {
  let token = req.cookies["atlantis_token"]
  if (!token) {
    if (!token) throw new Error('Token não encontrado')
  }
  return token
}