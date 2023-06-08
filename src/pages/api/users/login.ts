import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import {dbOperations} from "../auth/dbUserOperations";

// POST /api/users/login
export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("LOGGING IN!");
    try {
      // Retrieve the login credentials from the request body
      const { email, password } = req.body;
      // Handle login logic here
      const user = await dbOperations.getUser(email);
      if (!user?.password) {
        //means that they used google auth to sign up before, and must authenticate through their OAUTH login view
        res.status(401).json({ error: "It looks like this email was registered through an Auth partner. To protect your account, please login through our partner portal and set your password through your account portal" });
        return;
      }
      if (!user) {
        res.status(401).json({ error: "Invalid login credentials" });
        return;
      }
      var validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({ error: "Invalid login credentials" });
        return;
      }
      //sign them in and validate them
      res.status(200).json({ message: "Login successful" });

    } catch (error) {
      console.log("ERROR LOGGING IN");
      console.log(error);
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
