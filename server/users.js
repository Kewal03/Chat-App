const users = []; // Initialize an empty array to store users

// Function to add a user
const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Check if user already exists in the room
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  // If user already exists, return an error
  if (existingUser) {
    return { error: "User already exists!" };
  }

  // Otherwise, add the user and return the new user object
  const user = { id, name, room };
  users.push(user);
  return { user };
};

// Function to remove a user
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Function to get a user by ID
const getUser = (id) => users.find((user) => user.id === id);

// Function to get users in a room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
