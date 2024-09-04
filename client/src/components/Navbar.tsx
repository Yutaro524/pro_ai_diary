import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, provider, signInWithPopup, signOut } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { navbar, navbarToggle, offcanvasStyle } from '../css/styles.css'; // スタイルをインポート
import { useMediaQuery } from 'react-responsive'; // 追加

const NavigationBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 992 }); // 画面幅が992px以下の場合にtrue

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

  if (isMobile) {
    return (
      <>
        <Navbar className={`fixed-top navbar ${navbar}`} bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="/">My App</Navbar.Brand>
            <Button
              variant="outline-light"
              onClick={() => setShowOffcanvas(true)}
              className={navbarToggle}
            >
              Menu
            </Button>
          </Container>
        </Navbar>

        <Offcanvas
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          placement="end"
          className={offcanvasStyle}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {user ? (
                <>
                  <Nav.Link>{user.displayName}</Nav.Link>
                  {location.pathname === '/pro_ai_diary/' ? (
                    <Nav.Link href="/memo">stories</Nav.Link>
                  ) : (
                    <Nav.Link href="/">Calendar</Nav.Link>
                  )}
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
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }

  return (
    <Navbar className={`fixed-top navbar ${navbar}`} bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">My App</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link>{user.displayName}</Nav.Link>
                {location.pathname === '/' ? (
                  <Nav.Link href="/memo">stories</Nav.Link>
                ) : (
                  <Nav.Link href="/">Calendar</Nav.Link>
                )}
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
