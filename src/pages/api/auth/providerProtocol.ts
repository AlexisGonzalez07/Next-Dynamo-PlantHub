import { User } from "next-auth";
import {getUser, createUser} from "../../../utils/dynamodb"


export const protocol = {
  async google(user: User | any) {
    const email = user.email;
    const userIfFound = await getUser(email)
    if (userIfFound) {
      return true;
    }
    const firstName = user.name.trim().split(" ")[0];
    const lastName = user.name.trim().split(" ")[1];
    return createUser(email, firstName, lastName);
  },
};
