# Class Management System

A desktop application for face recognition attendance system. Built with **Python**, **Electron**, **React**, and **SQLite**.

## Features

- **Face Recognition Attendance System**: You can easily managing attendance with face recognition.
- **Admin Authentication**: Secure the admin panel with an encrypted password stored in a JSON file.
- **Manage Classes**: Add, view, and assign students to classes.
- **Class Sessions**: View and manage class sessions, including attendance.
- **Responsive UI**: Built using Tailwind CSS for a modern, responsive interface.

## Technologies Used

- **Frontend**: React with Tailwind CSS
- **Backend**: Python & Electron with Node.js
- **Database**: SQLite
- **Password Encryption**: bcrypt
- **IPC Communication**: Electron's `ipcMain` and `ipcRenderer`

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repo/your-app.git
   cd class-management-system
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   - Create a `pw.json` file in the root directory.
   - Add the following variables:
     `json
 {
    "adminPasswordHash": "YourHashedPassword"
 }
`

4. **Start the application**:
   ```bash
   npm install
   cd front/
   npm install
   cd ..
   npm run start
   ```

## Usage

### Admin Login

- The admin panel is secured with a password prompt.
- You can update the password using the "Change Password" feature in the admin panel.

### Managing Classes

1. Navigate to the **Admin Panel**.
2. Use the buttons to add new classes, students, sessions, or assign students to classes.

### Viewing Sessions and Attendance

1. Select a class from the dropdown.
2. Click on a session's **Attendance Count** to view detailed attendance records.

## Security

- Passwords are stored as hashed values in a `pw.json` file for enhanced security.
- IPC communication is secured using Electron's `contextBridge`.

## Troubleshooting

1. **Password Not Updating**: Ensure the `pw.json` file is writable and updated correctly.
2. **Database Errors**: Check if the SQLite database file is accessible and matches the schema.
3. **UI Issues**: Ensure Tailwind CSS is correctly installed and integrated.

## Contribution

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your branch:
   ```bash
   git push origin feature-name
   ```
4. Create a pull request.

---

🥹
