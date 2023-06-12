import NextAuth, { User, Account, Profile, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUser, createUser } from "../../../utils/dynamodb.ts";
import { protocol } from "./providerProtocol.ts";
import bcrypt from "bcrypt";
interface SignInValue {
  user: User | any;
  account: Account;
  profile: Profile;
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
      authorize: async (credentials) => {
        const {
          email,
          firstName,
          lastName,
          username,
          password,
          confirmPassword,
        } = credentials;
        const user = await getUser(email);
        //this should mean that they're signing up.
        if (!user && confirmPassword) {
          console.log("USER WAS NOT FOUND AND MAKING NEW USER");
          const salt = await bcrypt.genSalt(10);
          const created = await createUser(
            email,
            firstName,
            lastName,
            username,
            await bcrypt.hash(password, salt),
          );
          if (!created) {
            throw new Error("Unable to sign up");
          }
          return null;
        }
        if (!user) {
          //this means no user found
          console.log("USER WAS NOT FOUND");

          throw new Error("Invalid login credentials");
        }
        //means that they used an auth provider to sign up before, and must authenticate through their OAUTH login view
        if (!user?.password) {
          console.log("USER WAS FOUND but through AUTH");
          throw new Error(
            "It looks like this email was registered through an Auth partner. To protect your account, please login through our partner portal and set your password through your account portal"
          );
        }
        var validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          //invalid password catch
          throw new Error("Invalid login credentials");
        }

        //I have a valid user
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn(value: SignInValue) {
      switch (value.account.provider) {
        case "google":
          //The code caused an error because I'm not specifying that profile is from google and has email_verified
          // if (!value.profile?.email_verified) {
          //   console.log("PREVENT SPAM ACCOUNTS");
          //   return false;
          // }
          console.log(value)
          return protocol.google(value.user);
        default:
          return true;
      }
    },
  },
};
export default NextAuth(options);
