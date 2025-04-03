"use client";
import { useState, useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { logout, setUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiPenTool,
  FiLink,
  FiLock,
  FiSettings,
  FiCalendar,
} from "react-icons/fi";

const useProfile = () => {
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [name, setName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [language, setLanguage] = useState("English");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h (am/pm)");
  const [country, setCountry] = useState("Pakistan");
  const [timeZone, setTimeZone] = useState("Pakistan, Mulkisan Time");
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || null
  );
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    if (user?.userName) setName(user?.userName);
    if (user?.welcomeMessage) setWelcomeMessage(user?.welcomeMessage);
    if (user?.profilePicture) setProfilePicture(user?.profilePicture);
  }, [user?.userName, user?.welcomeMessage, user?.profilePicture]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user.email) return;
      try {
        const response = await fetch(`/api/get-user?email=${user.email}`);
        if (response.ok) {
          const userData = await response.json();
          setName(userData?.fullName || "");
          setWelcomeMessage(userData?.welcomeMessage || "");
          setLanguage(userData?.language || "English");
          setDateFormat(userData?.dateFormat || "DD/MM/YYYY");
          setTimeFormat(userData?.timeFormat || "12h (am/pm)");
          setCountry(userData?.country || "Pakistan");
          setTimeZone(userData?.timeZone || "Pakistan, Mulkisan Time");
          setProfilePicture(userData?.profilePicture || null);
          dispatch(
            setUser({
              ...user,
              fullName: userData?.fullName || "",
              welcomeMessage: userData?.welcomeMessage || "",
              profilePicture: userData?.profilePicture || null,
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
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
        dispatch(
          setUser({
            ...user,
            fullName: name,
            welcomeMessage,
            profilePicture,
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
    const file = event?.target?.files[0];
    if (!file) return;
    const formData = new FormData();
    formData?.append("profilePicture", file);
    formData?.append("email", user.email);
    try {
      const response = await fetch("/api/upload-profile-picture", {
        method: "POST",
        body: formData,
      });
      if (response?.ok) {
        const result = await response.json();
        setProfilePicture(result?.imageUrl);
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
    setShowDeletePopup(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      if (response.ok) {
        alert("Account deleted successfully!");
        dispatch(logout());
        router.push("/");
      } else {
        alert("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting the account.");
    } finally {
      setShowDeletePopup(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeletePopup(false);
  };

  return {
    user,
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
    profilePicture,
    setProfilePicture,
    showDeletePopup,
    handleLogout,
    handleSaveChanges,
    handlePictureUpload,
    handleDeleteAccount,
    confirmDeleteAccount,
    cancelDeleteAccount,
  };
};

export default useProfile;
