import { useAxiosClient } from "../axios";

export function GetUsers() {
    return useAxiosClient().get("api/messages/users");
}
export function GetContacts() {
    return useAxiosClient().get("api/messages/contacts");
}

export function MessageHistory(user_Id) {
  return useAxiosClient().get(`api/messages/${user_Id}`);
}

export function Send_Message(user_Id, data) {
  return useAxiosClient().post(`api/messages/send/${user_Id}`,{ 
    content : data,
});
}