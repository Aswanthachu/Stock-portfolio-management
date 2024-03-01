import React from "react";

const UserTable = ({ users, activeUsers }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Last Login</th>
          <th>Plan</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.lastLogin}</td>
            <td>{user.plan}</td>
            <td>{user.role}</td>
            <td>{activeUsers.includes(user.id) ? "Online" : "Last Seen"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;