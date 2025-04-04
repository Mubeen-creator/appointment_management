"use client";
import {
  FiUser,
  FiHelpCircle,
  FiLogOut,
  FiChevronLeft,
  FiInfo,
} from "react-icons/fi";
import Link from "next/link";
import useProfile from "./useProfile";
import { FiChevronDown } from "react-icons/fi";
import { links } from "@/constants/timeSlot";
import Loader from "@/components/loader/Loader";

export default function Profile() {
  const {
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
    isLoading,
    profilePicture,
    setProfilePicture,
    showDeletePopup,
    handleLogout,
    handleSaveChanges,
    handlePictureUpload,
    handleDeleteAccount,
    confirmDeleteAccount,
    cancelDeleteAccount,
  } = useProfile();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-5">
      {isLoading && <Loader />}
      <div className="w-full md:w-64 md:fixed md:h-screen border-r border-gray-200 bg-white z-10">
        <div className="hidden md:flex items-center p-4 border-b border-gray-200">
          <img src="/logo.png" alt="Calendly" className="h-10" />
        </div>
        <div className="p-4">
          <Link
            href="/dashboard"
            className="flex items-center text-blue-600 mb-6"
          >
            <FiChevronLeft size={16} className="mr-2" />
            <span className="text Wagen sm">Back to home</span>
          </Link>
          <h2 className="text-lg font-medium mb-4">Account settings</h2>
          <nav className="space-y-1">
            {links.map(({ href, icon: Icon, label, active }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center py-2 px-3 rounded-md ${
                  active
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 font-semibold"
                }`}
              >
                <Icon size={16} className="mr-3" />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-gray-200 p-4 absolute bottom-0 w-full">
          <div className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
            <FiHelpCircle size={16} className="mr-3" />
            <span className="text-sm">Help</span>
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
          >
            <FiLogOut size={16} className="mr-3" />
            <span className="text-sm">Logout</span>
          </div>
        </div>
      </div>
      <div className="md:ml-64 overflow-auto p-4 md:p-8 md:pt-20 bg-gray-50 flex-1">
        <div className="max-w-3xl">
          <div className="flex flex-col mb-6">
            <span className="text-md text-gray-600">Account details</span>
            <h1 className="text-2xl font-medium">Profile</h1>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FiUser size={32} className="text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="profilePictureInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePictureUpload}
                  disabled={isLoading}
                />
                <label
                  htmlFor="profilePictureInput"
                  className={`px-4 py-2 border border-gray-300 rounded-full text-sm cursor-pointer ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Upload picture
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, GIF or PNG. Max size of 5MB.
                </p>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center mb-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <FiInfo size={14} className="ml-1 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e?.target?.value)}
                className="w-full md:w-100 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <div className="flex items-center mb-1">
                <label
                  htmlFor="welcomeMessage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Welcome Message
                </label>
                <FiInfo size={14} className="ml-1 text-gray-400" />
              </div>
              <textarea
                id="welcomeMessage"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e?.target?.value)}
                rows={4}
                className="w-full md:w-100 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Language
              </label>
              <div className="relative w-full md:w-100">
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option>English</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Spanish</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                  <FiChevronDown size={18} />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row mb-6 w-full md:w-100">
              <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
                <div className="flex items-center mb-1">
                  <label
                    htmlFor="dateFormat"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date Format
                  </label>
                  <FiInfo size={14} className="ml-1 text-gray-400" />
                </div>
                <div className="relative">
                  <select
                    id="dateFormat"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e?.target?.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY/MM/DD</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                    <FiChevronDown size={18} />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 md:pl-2">
                <div className="flex items-center mb-1">
                  <label
                    htmlFor="timeFormat"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Time Format
                  </label>
                  <FiInfo size={14} className="ml-1 text-gray-400" />
                </div>
                <div className="relative">
                  <select
                    id="timeFormat"
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e?.target?.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <option>12h (am/pm)</option>
                    <option>24h</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                    <FiChevronDown size={18} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country
              </label>
              <div className="relative w-full md:w-100">
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option>Pakistan</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                  <FiChevronDown size={18} />
                </div>
              </div>
            </div>
            <div className="mb-6 w-full md:w-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                <label
                  htmlFor="timeZone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time Zone
                </label>
                <div className="text-xs text-gray-500 mt-1 md:mt-0">
                  Current Time: 5:30pm
                </div>
              </div>
              <div className="relative w-full">
                <select
                  id="timeZone"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option>Pakistan, Mulkisan Time</option>
                  <option>GMT, Greenwich Mean Time</option>
                  <option>EST, Eastern Standard Time</option>
                  <option>PST, Pacific Standard Time</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                  <FiChevronDown size={18} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveChanges}
                className={`bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                Save Changes
              </button>
              <button
                className={`border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className={`bg-red-700 cursor-pointer text-white px-4 py-2 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 md:ml-[180px] ml-10 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                Delete Account
              </button>
            </div>
          </div>
          {showDeletePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-medium mb-4">
                  Confirm Account Deletion
                </h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelDeleteAccount}
                    className={`border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteAccount}
                    className={`bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
