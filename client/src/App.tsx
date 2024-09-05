import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth, registerUser, getUserFromFirestore, onAuthStateChanged } from './firebase';
import { User } from 'firebase/auth';
import { Calendar } from './components/Calendar';
import NavigationBar from './components/Navbar';
import { StoryListPage } from './components/storylist';
import './App.css';

const baseurl = import.meta.env.VITE_BASE_URL || '/';  // デフォルトで '/' を設定

const App: React.FC = () => {
  console.log(baseurl);
  console.log(import.meta.env.VITE_BASE_URL);
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
              <Route path={`${baseurl}`} element={<Calendar />} />
              <Route path={`${baseurl}memo`} element={<StoryListPage />} />
            </>
          ) : (
            <Route path={`${baseurl}`} element={<div>ログインしてください</div>} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
