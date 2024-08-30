import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, provider, signInWithPopup, signOut } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { navbar } from '../css/styles.css';

const NavigationBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
        <Navbar className={`fixed-top navbar ${navbar}`} bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">My App</Navbar.Brand>
                <Nav className="ms-auto">
                    {user ? (
                        <>
                        <Nav.Link href="/profile">{user.displayName}</Nav.Link>
                        <Button variant="outline-light" onClick={handleLogout}>
                            Logout
                        </Button>
                        </>
                    ) : (
                        <Button variant="outline-light" onClick={handleLogin}>
                        Login with Google
                        </Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
  );
};

export default NavigationBar;
