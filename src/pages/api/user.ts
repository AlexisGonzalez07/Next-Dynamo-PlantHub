import {getUser} from "../../utils/dynamodb"
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.query)
    const email =req.query.email as string
    const user = await getUser(email)
    const parsedPlants = await JSON.parse(user.plants)
    user.plants = parsedPlants
    if(user?.password?.length) user.password = true
    res.status(200).json(user)
  }