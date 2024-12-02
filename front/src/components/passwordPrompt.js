import React, { useState } from "react";

function AdminPasswordPrompt({ onAccessGranted }) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isChangingPassword) {
      // Handle changing password
      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match.");
        return;
      }

      try {
        const isValid = await window.electron.validateAdminPassword(password);
        if (isValid) {
          await window.electron.changeAdminPassword(newPassword);
          alert("Password changed successfully.");
          setIsChangingPassword(false); // Switch back to verify mode
        } else {
          setError("Incorrect current password.");
        }
      } catch (error) {
        console.error("Error changing password:", error);
        setError("Failed to change password.");
      }
    } else {
      // Handle verifying password for access
      try {
        const isValid = await window.electron.validateAdminPassword(password);
        if (isValid) {
          onAccessGranted(); // Allow access to the admin page
        } else {
          setError("Incorrect password, try again.");
        }
      } catch (error) {
        console.error("Error validating password:", error);
        setError("Failed to verify password.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isChangingPassword
            ? "Change Admin Password"
            : "Enter Admin Password"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Enter Current Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isChangingPassword && (
            <>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={handleConfirmNewPasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isChangingPassword ? "Submit New Password" : "Submit"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {!isChangingPassword && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsChangingPassword(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPasswordPrompt;
