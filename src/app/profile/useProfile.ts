"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout, setUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";

const useProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  // Form state, initializing from Redux user state
  const [name, setName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [language, setLanguage] = useState("English");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h (am/pm)");
  const [country, setCountry] = useState("Pakistan");
  const [timeZone, setTimeZone] = useState("Pakistan, Mulkisan Time");
  // const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(
    user.profilePicture || null
  );

  // Initialize name with userName on initial load
  useEffect(() => {
    if (user.userName) {
      setName(user.userName); // Set initial name to userName
    }
    if (user.welcomeMessage) {
      setWelcomeMessage(user.welcomeMessage);
    }
    if (user.profilePicture) {
      setProfilePicture(user.profilePicture);
    }
  }, [user.userName, user.welcomeMessage, user.profilePicture]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/"); // Redirect to the home or login page after logout
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user.email) return;

      try {
        const response = await fetch(`/api/get-user?email=${user.email}`);
        if (response.ok) {
          const userData = await response.json();

          // Update form state with fetched data
          setName(userData.fullName || "");
          setWelcomeMessage(userData.welcomeMessage || "");
          setLanguage(userData.language || "English");
          setDateFormat(userData.dateFormat || "DD/MM/YYYY");
          setTimeFormat(userData.timeFormat || "12h (am/pm)");
          setCountry(userData.country || "Pakistan");
          setTimeZone(userData.timeZone || "Pakistan, Mulkisan Time");
          setProfilePicture(userData.profilePicture || null);

          // Update Redux store
          dispatch(
            setUser({
              ...user,
              fullName: userData.fullName || "",
              welcomeMessage: userData.welcomeMessage || "",
              profilePicture: userData.profilePicture || null,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.email, dispatch]);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/update-profile", {
        method: "PUT", // Changed from POST to PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          fullName: name,
          welcomeMessage,
          language,
          dateFormat,
          timeFormat,
          country,
          timeZone,
          profilePicture,
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        // Update Redux store
        dispatch(
          setUser({
            ...user,
            fullName: name,
            welcomeMessage: welcomeMessage,
            profilePicture: profilePicture,
          })
        );
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const handlePictureUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("email", user.email); // Assuming email is used to identify the user

    try {
      const response = await fetch("/api/upload-profile-picture", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setProfilePicture(result.imageUrl); // Update state with the new image URL
        alert("Profile picture updated successfully!");
      } else {
        alert("Failed to upload profile picture.");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("An error occurred while uploading the profile picture.");
    }
  };

  const handleDeleteAccount = () => {
    // Handle delete account logic here
    console.log("Delete account requested");
  };

  return {
    user,
    dispatch,
    router,
    name,
    setName,
    welcomeMessage,
    setWelcomeMessage,
    language,
    setLanguage,
    dateFormat,
    setDateFormat,
    timeFormat,
    setTimeFormat,
    country,
    setCountry,
    timeZone,
    setTimeZone,
    loading,
    setLoading,
    profilePicture,
    setProfilePicture,
    useEffect,
    handleLogout,
    handleSaveChanges,
    handlePictureUpload,
    handleDeleteAccount,
  };
};

export default useProfile;
