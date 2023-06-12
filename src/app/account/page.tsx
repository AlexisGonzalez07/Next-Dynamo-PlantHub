"use client";
import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { UserContext, ThemeContext } from "../providers";
import Loading from "../../components/Loading";
import Credentials from "../../components/Credentials";
export default function Home() {
  const {data, loading, error } = useContext(UserContext);
  const [checkedTab, setCheckedTab] = useState<String>("");
  const {theme,toggleTheme} = useContext(ThemeContext)
  const {status} = useSession()
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
  if (status !=="authenticated") {
    return <Credentials />;

  }
  const handleCheckBoxChange = (section: string) => {
    if (checkedTab === section) {
      setCheckedTab("");
      return;
    }
    setCheckedTab(section);
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-around text-secondary max-w-lg mx-1 p-1">
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
          <p>Sign Out Button</p>
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
    <input type="radio" name="radio-10" className="radio checked:bg-primary" onChange={() => toggleTheme("light")} checked={theme === "light"? true: false}/>
  </label>
</div>
<div className="form-control">
  <label className="label cursor-pointer">
    <span className="label-text text-primary">Dark Mode</span> 
    <input type="radio" name="radio-10" className="radio checked:bg-primary" onChange={() => toggleTheme("dark")}
    checked={theme === "dark"? true: false}/>
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
