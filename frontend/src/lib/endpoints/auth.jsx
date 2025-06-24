import { useAxiosClient } from "../axios";

export function CheckAuth(){
  return useAxiosClient().get("api/auth/authenticate")
}

export function CreateUser(email ,username, password) {
    console.log(email)
    console.log(username)
    console.log(password)
    return useAxiosClient().post("/api/auth/register", {
    email: email,
    username: username,
    password: password,
  });
}

export function LoginUser(username, password) {
  console.log(username)
  console.log(password)
  return useAxiosClient().post("/api/auth/login", {
    username,
    password,
  });
}

export function LogoutUser() {
  return useAxiosClient().post("/api/auth/logout")
}
