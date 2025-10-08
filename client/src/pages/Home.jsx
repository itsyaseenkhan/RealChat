import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const Home = () => {
  const { selectedUser } = useSelector((state) => state.chat);

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="flex h-screen w-screen pt-16 px4">
          <div className="bg-white w-full h-full">
            <div className="flex h-full overflow-hidden">
              <Sidebar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
