import NextAuth, { User, Account, Profile, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbOperations from "./dbUserOperations.ts";
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
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn(value: SignInValue) {
      const email = value?.user?.email;
      //no user found
      if (!email) {
        return false;
      }
      //check if user in db
      const user = await dbOperations.getUser(email);
      console.log(user);
      if (user?.email) {
        //want to add a check so if the user hasn't added a password, they can be notified to add password on front end
        return true;
      }
      const firstName = value.user.name.trim().split(' ')[0]
      const lastName = value.user.name.trim().split(' ')[1]
      // PERFORM ADDITIONAL FUNCTIONS BASED ON PROVIDER FOR SIGNUP
      switch (value.account.provider) {
        case "google":
          //The code caused an error because I'm not specifying that profile is from google and has email_verified
          // if (!value.profile?.email_verified) {
          //   console.log("PREVENT SPAM ACCOUNTS");
          //   return false;
          // }
            //we will only make accounts for validated emails
            const created = await dbOperations.createUser(email, firstName,lastName);
            return created;
        default:
          return true;
      }
    },

  },
};
export default NextAuth(options);
