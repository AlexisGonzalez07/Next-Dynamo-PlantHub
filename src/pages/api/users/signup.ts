import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import {dbOperations} from "../auth/dbUserOperations";

// POST /api/users/signup
export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("PINGED!!");
  if (req.method === "POST") {
    const { email, firstName, lastName, username, password } = req.body;
    //check if user in db to prevent duplicates
    const user = await dbOperations.getUser(email);
    if (!user) {
      //create the user with req.body information
      //allow them to sign in somehow.
      // NEed to learn JWT to sign the token
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const created = await dbOperations.createUser(
        email,
        firstName,
        lastName,
        username,
        await bcrypt.hash(password, salt)
      );
      created
        ? res.status(200).json({ message: "User authenticated!" })
        : res.status(500).json({ error: "Error creating account, please try again" });
      return;
    }
    if (!user.password) {
      //means that they used google auth to sign up before, and must authenticate through their OAUTH login view
      res.status(401).json({ error: "It looks like this email was registered through an Auth partner. To protect your account, please login through our partner portal and set your password through your account portal" });
      return
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
