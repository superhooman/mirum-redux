export const login = (user, token, remember) => ({
  type: "LOGIN",
  user,
  token,
  remember
});

export const toggleDrawer = (value) => ({
  type: "TOGGLE_DRAWER",
  value,
});

export const setCourses = (courses) => ({
  type: "SET_COURSES",
  courses,
});

export const logout = () => ({
  type: "LOGOUT",
})