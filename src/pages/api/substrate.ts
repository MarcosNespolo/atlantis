import { NextApiRequest, NextApiResponse } from 'next'
import createNewSubstrate from '../../services/substrate'
import { Substrate } from '../../utils/constants'

const organisation_address = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'POST': {
        const substrate: Substrate = req.body

        const response = await createNewSubstrate(substrate)

        return res.status(response.statusCode).json(response.message)
      }
      case 'GET': {

      }
      case 'PUT': {

      }
      case 'DELETE': {

      }
      default: {
        return res.status(400).json("Requisição HTTP inválida")
      }
    }
  } catch (error: any) {
    console.log(error)
    return res.status(error.statusCode).json({ error: error.message })
  }
}

export default organisation_address