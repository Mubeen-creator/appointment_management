// Updated profile route page
"use client";
import {
  FiUser,
  FiPenTool,
  FiLink,
  FiLock,
  FiSettings,
  FiCalendar,
  FiHelpCircle,
  FiLogOut,
  FiChevronLeft,
  FiInfo,
} from "react-icons/fi";
import Link from "next/link";
import useProfile from "./useProfile";

export default function Profile() {
  const {
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
  } = useProfile();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Header - Mobile Only */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <img src="/logo.png" alt="Calendly" className="h-10" />
        </div>
        <button className="text-blue-600 bg-blue-50 rounded-md px-3 py-1 text-sm font-medium">
          Invite user
        </button>
      </div>

      {/* Left Sidebar - Now Fixed */}
      <div className="w-full md:w-64 md:fixed md:h-screen border-r border-gray-200 bg-white z-10">
        {/* Logo - Desktop Only */}
        <div className="hidden md:flex items-center p-4 border-b border-gray-200">
          <img src="/logo.png" alt="Calendly" className="h-10" />
        </div>

        <div className="p-4">
          <Link
            href="/dashboard"
            className="flex items-center text-blue-600 mb-6"
          >
            <FiChevronLeft size={16} className="mr-2" />
            <span className="text-sm">Back to home</span>
          </Link>

          <h2 className="text-lg font-medium mb-4">Account settings</h2>

          <nav className="space-y-1">
            <Link
              href="/profile"
              className="flex items-center py-2 px-3 bg-gray-100 rounded-md text-blue-600"
            >
              <FiUser size={16} className="mr-3" />
              <span className="text-sm">Profile</span>
            </Link>
            <Link
              href="/branding"
              className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <FiPenTool size={16} className="mr-3" />
              <span className="text-sm">Branding</span>
            </Link>
            <Link
              href="/links"
              className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <FiLink size={16} className="mr-3" />
              <span className="text-sm">My Link</span>
            </Link>
            <Link
              href="/login-preferences"
              className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <FiLock size={16} className="mr-3" />
              <span className="text-sm">Login preferences</span>
            </Link>
            <Link
              href="/cookie-settings"
              className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <FiSettings size={16} className="mr-3" />
              <span className="text-sm">Cookie settings</span>
            </Link>
            <Link
              href="/calendar-sync"
              className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <FiCalendar size={16} className="mr-3" />
              <span className="text-sm">Calendar sync</span>
            </Link>
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

      {/* Main Content - With Left Margin to Account for Fixed Sidebar */}
      <div className="flex-1 md:ml-64 overflow-auto p-4 md:p-8 bg-gray-50">
        <div className="max-w-3xl">
          <div className="flex flex-col mb-6">
            <span className="text-sm text-gray-500">Account details</span>
            <h1 className="text-2xl font-medium">Profile</h1>
          </div>

          <div className="bg-white rounded-md shadow-sm p-6 mb-6">
            {/* Profile Picture */}
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
                />
                <label
                  htmlFor="profilePictureInput"
                  className="px-4 py-1 border border-gray-300 rounded-md text-sm cursor-pointer"
                >
                  Upload picture
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, GIF or PNG. Max size of 5MB.
                </p>
              </div>
            </div>
            {/* Name */}
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
                onChange={(e) => setName(e.target.value)}
                className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* Welcome Message */}
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
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            ... {/* Language */}
            <div className="mb-6">
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Language
              </label>
              <div className="relative w-full md:w-80">
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>English</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Spanish</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {/* Date and Time Format */}
            <div className="flex flex-col md:flex-row mb-6">
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
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY/MM/DD</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
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
                    onChange={(e) => setTimeFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>12h (am/pm)</option>
                    <option>24h</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            ... {/* Country */}
            <div className="mb-6">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country
              </label>
              <div className="relative w-full md:w-80">
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>Pakistan</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {/* Time Zone */}
            <div className="mb-6">
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
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>Pakistan, Mulkisan Time</option>
                  <option>GMT, Greenwich Mean Time</option>
                  <option>EST, Eastern Standard Time</option>
                  <option>PST, Pacific Standard Time</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveChanges}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Save changes
            </button>
          </div>

          {/* Delete Account */}
          <div className="bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Delete Account</h2>
            <p className="text-gray-600 mb-4">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
