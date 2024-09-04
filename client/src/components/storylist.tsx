import { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import { User } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { ModalAIStory } from './ModalAIStory';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Stories } from '../css/styles.css';

async function fetchAIStories(userId: string) {
    const snapshot = await getDocs(collection(firestore, `users/${userId}/aiStories`));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        story: doc.data().story,
        startDate: doc.data().startDate,
        endDate: doc.data().endDate,
    }));
}

export function StoryListPage() {
    const [stories, setStories] = useState<{ id: string, story: string, startDate: { seconds: number }, endDate: { seconds: number } }[]>([]);
    const [, setUser] = useState<User | null>(null);
    const [selectedStory, setSelectedStory] = useState<{ id: string, story: string, startDate: { seconds: number }, endDate: { seconds: number } } | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            setUser(authUser);
            if (authUser) {
                const fetchedStories = await fetchAIStories(authUser.uid);
                setStories(fetchedStories);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleClick = (story: { id: string, story: string, startDate: { seconds: number }, endDate: { seconds: number } }) => {
        setSelectedStory(story);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    return (
        <div className={Stories}>
            <h1>AI生成ストーリー一覧</h1>
            {stories.length > 0 ? (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {stories.map(story => (
                        <Col key={story.id}>
                            <Card>
                                <Card.Body>
                                    <Card.Text>
                                        {story.story.substring(0, 50)}... {/* 最初の50文字を表示 */}
                                    </Card.Text>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        開始日: {new Date(story.startDate.seconds * 1000).toLocaleDateString()}
                                    </Card.Subtitle>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        終了日: {new Date(story.endDate.seconds * 1000).toLocaleDateString()}
                                    </Card.Subtitle>
                                    <Button variant="primary" onClick={() => handleClick(story)}>
                                        詳細を見る
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>ストーリーがまだありません。</p>
            )}

            {selectedStory && (
                <ModalAIStory
                    show={showModal}
                    closeModal={handleClose}
                    selectedDate={{
                        start: new Date(selectedStory.startDate.seconds * 1000),
                        end: new Date(selectedStory.endDate.seconds * 1000)
                    }}
                    AIStory={selectedStory.story}
                />
            )}
        </div>
    );
}

export default StoryListPage;
