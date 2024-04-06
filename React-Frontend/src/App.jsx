
import ChatMessages from './components/chatMessages';
import UserDetails from './components/userDetails';
import MessageDetails from './components/messageDetails';


function App() {
  return (
    <div className="App">
      <ChatMessages chatId={3} />
      <ChatMessages chatId={8} renderAsJSON />
      <UserDetails userId={100} />
      <MessageDetails messageId={459} />
    </div>
  );
}

export default App; 