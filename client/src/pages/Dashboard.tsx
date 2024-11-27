import { useAuthStore } from "@/store/useStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logOut } = useAuthStore();
  console.log(user);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      const data = response.data;
      console.log("**********");
      console.log("logout data response", data);
      console.log("**********");

      logOut();
      navigate("/");
    } catch (e) {
      console.log(e.response);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen flex-wrap text-stone-800 text-5xl">
      <h1>Welcome, {user?.firstName}</h1>
      <button
        onClick={handleLogout}
        className="border border-stone-800 text-center mt-5 text-stone-800 px-10 py-2 rounded text-xl"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
