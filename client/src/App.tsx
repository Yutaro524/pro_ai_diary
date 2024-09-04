import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Router basename="/pro_ai_diary">
      <div className="App">
        <NavigationBar />
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Calendar />} />
              <Route path="memo" element={<StoryListPage />} />
            </>
          ) : (
            <Route path="/" element={<div>ログインしてください</div>} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
