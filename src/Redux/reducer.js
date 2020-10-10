const getJSONfromLocalStorage = (key) => {
  let res;
  try {
    res = JSON.parse(localStorage.getItem(key));
  } catch (err) {
    res = null;
  }
  return res;
};

const saveJSONInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const initialState = {
  user: null,
  token: localStorage.getItem("mirumToken"),
  drawer: false,
  courses: {
    isFetching: true,
    items: []
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN": {
      if (action.remember) {
        localStorage.setItem("mirumToken", action.token);
      }
      return {
        ...state,
        user: action.user,
        token: action.token,
      };
    }
    case "TOGGLE_DRAWER": {
      return {
        ...state,
        drawer: action.value,
      };
    }
    case "SET_COURSES": {
      return {
        ...state,
        courses: action.courses
      }
    }
    case "LOGOUT": {
      localStorage.setItem("mirumToken", "");
      return {
        ...state,
        token: "",
        user: null
      }
    }
    default: {
      return state;
    }
  }
};

export default reducer;
