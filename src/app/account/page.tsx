"use client"
import { useContext, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { UserContext, ThemeContext } from "../providers";
import Loading from "../../components/Loading";
import Credentials from "../../components/Credentials";
import { writeLastLogged } from "../../utils/idb";
export default function Account() {
  const { data, loading, error } = useContext(UserContext);
  const { data: session } = useSession();

    console.log("This is the Account Page");
  console.log(data);
  console.log(loading);
  console.log(session);
  const [checkedTab, setCheckedTab] = useState<String>("");
  const { theme, toggleTheme } = useContext(ThemeContext);
  useEffect(() => {
    console.log("rerender");
    console.log(data);
  }, [data]);
  if (!data && error === "Offline or Unauthenticated") {
    return <Credentials />;
  } else if (error) {
    return <h1>Undiagnozed accound error</h1>;
  }
  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const handleCheckBoxChange = (section: string) => {
    if (checkedTab === section) {
      setCheckedTab("");
      return;
    }
    setCheckedTab(section);
  };
  const handleSignOut = async () => {
    if (!data) {
      await signOut()
      if(window){
        window.location.replace("/")
        return
      }    }
    console.log("Signing out!");
    console.log("FORMATTED DATA");
    // Will definitely want to save the user email dat in the backend, need to configure. For now, I'll focus on removing idb and then, update the globalState to setError("Offline or Anauthenticated")
    // Additionally, I would like to delete the last_credentials database
    const {
      firstName,
      lastName,
      email,
      createdAt,
      username,
      password,
      plants,
      last_synced,
    } = data;
    const response = await fetch(`/api/user?email=${session.user.email}`, {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        createdAt,
        username,
        password,
        plants,
        last_synced,
      }),
    });
    console.log(response);
    const responseData = await response.json();
    if(responseData.message !== "All data uploaded"){
throw new Error("Error uploading to db")
    }
    // if successfull, change the data plants and remove key new or image_updated that I add to plants during creation/update
    // if not successfull, then store database but add a key so we can retry the attempt when next logged in
    // if we are not online, this will fail. Must check if we are connected to our servers.
    try {
      await writeLastLogged(undefined);
      console.log("Successfully reset db");
    } catch (error) {
      console.log("didn't empty credentials");
    }
    await signOut();
    if(window){
      window.location.replace("/")
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-around text-secondary max-w-lg p-1">
      <div className="collapse collapse-arrow bg-secondary text-primary mx-2">
        <input
          type="radio"
          name="my-accordion-2"
          checked={checkedTab === "Account" ? true : false}
          onChange={() => handleCheckBoxChange("Account")}
        />
        <div className="collapse-title text-xl font-medium">
          Account Settings
        </div>
        <div className="collapse-content text-primary">
          <p>Account Details</p>
          <p>Change Password</p>
          <button
            onClick={handleSignOut}
            className="btn btn-primary text-secondary"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="collapse collapse-arrow bg-secondary text-primary">
        <input
          type="radio"
          name="my-accordion-2"
          checked={checkedTab == "Settings" ? true : false}
          onChange={() => handleCheckBoxChange("Settings")}
        />{" "}
        <div className="collapse-title text-xl font-medium">
          Application Settings
        </div>
        <div className="collapse-content text-primary">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-primary">Light Mode</span>
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-primary"
                onChange={() => toggleTheme("light")}
                checked={theme === "light" ? true : false}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-primary">Dark Mode</span>
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-primary"
                onChange={() => toggleTheme("dark")}
                checked={theme === "dark" ? true : false}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="collapse collapse-arrow bg-secondary text-primary">
        <input
          type="radio"
          name="my-accordion-2"
          checked={checkedTab == "Membership" ? true : false}
          onChange={() => handleCheckBoxChange("Membership")}
        />{" "}
        <div className="collapse-title text-xl font-medium">
          Membership and Privacy
        </div>
        <div className="collapse-content text-primary">
          <p>Details To Come</p>
          <a href="/privacy" target="_blank" rel="nonreferrer">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
