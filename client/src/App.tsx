import { useState, useEffect } from 'react';
import { auth, registerUser, getUserFromFirestore, onAuthStateChanged } from './firebase';
import { User } from 'firebase/auth';
import { Calendar } from './components/Calendar';
import NavigationBar from './components/Navbar';
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
    <div className="App">
      <NavigationBar />
      {user ? (
        <Calendar />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default App;
