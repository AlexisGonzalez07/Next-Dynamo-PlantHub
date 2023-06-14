import NextAuth, { User, Account, Profile, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUser, createUser } from "../../../utils/dynamodb.ts";
import { protocol } from "./providerProtocol.ts";
import bcrypt from "bcrypt";
import {nanoid} from "nanoid"
interface SignInValue {
  user: User | any;
  account: Account;
  profile: Profile;
}
interface GoogleProfile extends Profile{
  email_verified: true|false
}

function isGoogleProfile(profile: any): profile is GoogleProfile {
  // Implement the type checking logic and return a boolean
  // indicating if the profile is of type GoogleProfile
  // For example:
  return (
    profile &&
    typeof profile === "object" &&
    // Add other necessary checks for the properties of GoogleProfile
    "email_verified" in profile 
  );
}
export interface NewUser {
  firstName: string, 
  lastName: string,
  createdAt: number,
  username: string,
  password: string,
  plants: []
}

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        confirmPassword: { label: "Confirm Password", type: "password" },
      },
      authorize: async (credentials,req?) => {
        const {
          email,
          firstName,
          lastName,
          username,
          password,
          confirmPassword,
        } = credentials;
        const user = await getUser(email, "credentials-request");
        console.log("This my user in authorize")
        console.log(user)
        //this should mean that they're signing up.
        if (!user && confirmPassword) {
          console.log("USER WAS NOT FOUND AND MAKING NEW USER");
          const salt = await bcrypt.genSalt(10);
          const createdAt = Date.now()
          console.log(createdAt)
          const hashedPassword = await bcrypt.hash(password, salt)
          const data = JSON.stringify({
            firstName,
            lastName,
            createdAt,
            username, 
            password: hashedPassword,
            plants: []
          } as NewUser)
          const created = await createUser(
            email,
            data,
          );
          if (!created) {
            throw new Error("Unable to sign up");
          }
          return {
            id: nanoid(),
            email,
            firstName,
            lastName,
            username
          };
        }
        if (!user) {
          //this means no user found in the login
          console.log("USER WAS NOT FOUND");
          throw new Error("Invalid Account Credentials");
        }
        //means that they used an auth provider to sign up before, and must authenticate through their OAUTH login view
        if (user.password === "") {
          throw new Error(
            "It looks like this email was previously registered. To protect your account, please login how you signed up and set your password through your account portal to enable normal login functionality."
          );
        }
        console.log("Comaring the password")
        console.log(user.password)
        var validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          //invalid password catch
          throw new Error("Invalid Account Credentials");
        }

        //I have a valid user
        console.log("valid user")
        return {
          id: nanoid(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        };
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn(value: SignInValue) {
      switch (value.account.provider) {
        case "google":
          //The code caused an error because I'm not specifying that profile is from google and has email_verified
          const profile = value.profile
          if(isGoogleProfile(profile)){
            console.log("PREVENT SPAM ACCOUNTS");
            return profile.email_verified === true
            ? protocol.google(value.user)
            : false
          }
          //fallback if implementation doesn't work
          return protocol.google(value.user);
        default:
          //currently this returns true if the provider is credentials
          return true;
      }
    },
  },
};
export default NextAuth(options);
