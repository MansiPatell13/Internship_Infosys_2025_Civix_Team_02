import React, { useEffect, useState } from "react";
import "./settings.css";

const BASE_URL = "http://localhost:4000/api/user/settings";

function Settings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deleteForm, setDeleteForm] = useState({
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleFetchError = async (response) => {
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error(`Received non-JSON response (Status: ${response.status}). Content snippet:`, text.substring(0, 100) + "...");
      return `Server returned a non-JSON response (Status: ${response.status}). Check backend logs or URL path.`;
    }

    try {
      const errorData = await response.json();
      return errorData.message || errorData.errors?.[0]?.msg || `Request failed with status ${response.status}.`;
    } catch (e) {
      return `Failed to parse JSON error response (Status: ${response.status}).`;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      resetMessages();
      setLoading(true);

      try {
        const headers = getAuthHeaders();
        const response = await fetch(BASE_URL, { method: "GET", headers });

        if (!response.ok) {
          throw new Error(await handleFetchError(response));
        }

        const data = await response.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          location: data.location || "",
        });
      } catch (err) {
        console.error("Fetch profile failed:", err);
        setError(err.message || "Failed to load user settings.");
      } finally {
        setLoading(false);
      }
    };

    try {
      getAuthHeaders();
      fetchProfile();
    } catch (e) {
      setError("Please log in to view settings.");
      setLoading(false);
    }
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleDeleteChange = (e) => {
    setDeleteForm({ ...deleteForm, password: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const headers = getAuthHeaders();
      const response = await fetch(BASE_URL, {
        method: "PUT",
        headers,
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(await handleFetchError(response));
      }

      const data = await response.json();

      setProfile({
        name: data.user.name,
        email: data.user.email,
        location: data.user.location,
      });
      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Profile update failed:", err);
      setError(err.message || "Failed to update profile. Check your input.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const headers = getAuthHeaders();

      const response = await fetch(`${BASE_URL}/password`, {
        method: "PUT",
        headers,
        body: JSON.stringify(passwordForm),
      });

      if (!response.ok) {
        throw new Error(await handleFetchError(response));
      }

      await response.json();

      setSuccess("Password changed successfully! Please log in again...");

      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (err) {
      console.error("Password change failed:", err);
      setError(err.message || "Failed to change password. Check inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!window.confirm("WARNING: Are you sure you want to delete your account? This action is irreversible.")) {
      return;
    }

    setLoading(true);

    try {
      const headers = getAuthHeaders();

      const response = await fetch(BASE_URL, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ password: deleteForm.password }),
      });

      if (!response.ok) {
        throw new Error(await handleFetchError(response));
      }

      await response.json();

      setSuccess("Account deleted successfully. Logging out...");

      localStorage.removeItem("token");

      window.location.href = "/login";
    } catch (err) {
      console.error("Account deletion failed:", err);
      setError(err.message || "Failed to delete account. Invalid password or server error.");
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="account-heading">Account Settings</h1>

      {loading && <p className="loading-message">Processing...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleProfileSubmit} className="settings-form">
        <h2>Profile Info</h2>
        <label>
          Name:
          <input type="text" name="name" value={profile.name} onChange={handleProfileChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={profile.email} onChange={handleProfileChange} />
        </label>
        <label>
          Location:
          <input type="text" name="location" value={profile.location} onChange={handleProfileChange} />
        </label>
        <button type="submit" disabled={loading}>
          Update Profile
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="settings-form">
        <h2>Change Password</h2>
        <label>
          Current Password:
          <input
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            required
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            required
            minLength="6"
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          Change Password
        </button>
      </form>

      <form onSubmit={handleDeleteSubmit} className="settings-form danger">
        <h2>Delete Account</h2>
        <label>
          Confirm Password:
          <input
            type="password"
            name="password"
            value={deleteForm.password}
            onChange={handleDeleteChange}
            required
          />
        </label>
        <button type="submit" className="delete-btn" disabled={loading}>
          Delete Account
        </button>
      </form>
    </div>
  );
}

export default Settings;