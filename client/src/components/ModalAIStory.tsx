import { Modal, Button } from 'react-bootstrap';
import { SelectDate } from './Calendar';

type ModalAIStoryProps = {
  show: boolean;
  closeModal: () => void;
  selectedDate: SelectDate | null;
  AIStory: string;
};

export function ModalAIStory(props: ModalAIStoryProps) {
  return (
    <Modal className="modal-lg" show={props.show} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>AIストーリー</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p><strong>選択された日付:</strong></p>
          <p>{props.selectedDate ? `${props.selectedDate.start.toDateString()} から ${props.selectedDate.end.toDateString()} まで` : 'なし'}</p>
        </div>
        <div>
          <p><strong>AIストーリー:</strong></p>
          <p>{props.AIStory}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.closeModal}>
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
