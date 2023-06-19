import { User } from "next-auth";
import {getUser, createUser} from "../../../utils/dynamodb"
import { NewUser } from "./[...nextauth]";


export const protocol = {
  async google(user: User) {
    const email = user.email;
    const userIfFound = await getUser(email);
    if (userIfFound) {
      return true;
    }
    const firstName = user.name.trim().split(" ")[0];
    const lastName = user.name.trim().split(" ")[1];
    const createdAt = Date.now();
    const username = firstName;
    const password = "";
    const data = JSON.stringify({
    firstName,
    lastName,
    createdAt,
    username,
    plants: []
    } as NewUser)
    return createUser(email, data,password);
  },
};
