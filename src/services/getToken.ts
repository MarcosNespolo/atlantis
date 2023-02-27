import { NextApiRequest } from 'next'

export default async function getToken(req: NextApiRequest) {
  let token = req.cookies["atlantis_token"]
  
  return token
}