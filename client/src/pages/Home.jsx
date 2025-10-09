import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const Home = () => {
  const { selectedUser } = useSelector((state) => state.chat);

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="flex flem items-center justify-center pt-20 px4">
          <div className="bg-white rounded-lg shadow-md w-full max-w-6x1 h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg   overflow-hidden">
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
