import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import { Logout as LogoutAction} from "../redux/AuthSlice";

export default function LogoutButton() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

const handleLogout = async () => {
    try {
      const request = await axios.post("http://localhost:3000/api/auth/logout");
      if (request.status === 200) {
        dispatch(LogoutAction());
        toast.success("Logout successful!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}