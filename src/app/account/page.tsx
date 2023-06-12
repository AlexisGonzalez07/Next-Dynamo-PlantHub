"use client";
import { useContext, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { UserContext, ThemeContext } from "../providers";
import Loading from "../../components/Loading";
import Credentials from "../../components/Credentials";
import { writeLastLogged } from "../../utils/idb";
export default function Home() {
  const { data, loading, error } = useContext(UserContext);
  const [checkedTab, setCheckedTab] = useState<String>("");
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { status } = useSession();

  if (error === "Offline or Unauthenticated") {
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
  if (status !== "authenticated") {
    return <Credentials />;
  }

  const handleCheckBoxChange = (section: string) => {
    if (checkedTab === section) {
      setCheckedTab("");
      return;
    }
    setCheckedTab(section);
  };
  const handleSignOut = async () => {
    console.log(data);
    //Will definitely want to save the user email dat in the backend, need to configure. For now, I'll focus on removing idb and then, update the globalState to setError("Offline or Anauthenticated")
    //Additionally, I would like to delete the last_credentials database
    try {
      await writeLastLogged(undefined);
      console.log("Successfully reset db");
    } catch (error) {
      console.log("didn't empty credentials");
    }
    const response = await fetch(`/api/user?email=${data.email}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log(response);
    const responseData = await response.json();
    //if successfull, change the data plants and remove key new or image_updated that I add to plants during creation/update
    console.log(responseData);
    //if not successfull, then store database but add a key so we can retry the attempt when next logged in
    //if we are not online, this will fail. Must check if we are connected to our servers.
    signOut();
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
          <button onClick={handleSignOut} className="btn btn-primary text-secondary">Sign Out</button>
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
        <div className="collapse-title text-xl font-medium">Membership</div>
        <div className="collapse-content text-primary">
          <p>Details To Come</p>
        </div>
      </div>
    </div>
  );
}
