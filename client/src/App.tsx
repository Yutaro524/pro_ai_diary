import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth, registerUser, getUserFromFirestore, onAuthStateChanged } from './firebase';
import { User } from 'firebase/auth';
import { Calendar } from './components/Calendar';
import NavigationBar from './components/Navbar';
import { StoryListPage } from './components/storylist';
import './App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userData = await getUserFromFirestore(authUser.uid);
        if (!userData) {
          // Firestoreにユーザー情報がない場合は登録
          await registerUser(authUser);
        }
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Routes>
          {user ? (
            <>
              <Route path="/pro_ai_diary/" element={<Calendar />} />
              <Route path="/pro_ai_diary/memo/" element={<StoryListPage />} />
            </>
          ) : (
            <Route path="/pro_ai_diary/" element={<div>ログインしてください</div>} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
