import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

type ModalDayMemoProps = {
  show: boolean;
  closeModal: () => void;
  registerSchedule: (title: string, memo: string, clickDate: string) => void;
  removeEvent: () => void;
  title: string;
  event: { title: string; memo: string; start: string; id: string } | null;
  clickDate: string; // 追加: 新しい予定の日付
};

export function ModalDayMemo(props: ModalDayMemoProps) {
  // state
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (props.event) {
      setScheduleTitle(props.event.title);
      setMemo(props.event.memo);
    } else {
      setScheduleTitle('');
      setMemo('');
    }
  }, [props.event, props.show]);

  /**
   * 予定登録処理
   */
  function registerSchedule() {
    // 親に予定情報を送る
    props.registerSchedule(scheduleTitle, memo, props.event ? props.event.start : props.clickDate);
    // 登録後にフォームをクリアする
    setScheduleTitle('');
    setMemo('');
  }

  return (
    <Modal show={props.show} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <p>日付: {props.clickDate}</p>
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '0.5rem' }}>
          <label style={{ width: '5rem' }}>タイトル</label>
          <input type="text" value={scheduleTitle} onChange={(e) => setScheduleTitle(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'start', paddingBottom: '0.5rem' }}>
          <label style={{ width: '5rem' }}>メモ</label>
          <textarea style={{ width: '20rem' }} value={memo} onChange={(e) => setMemo(e.target.value)} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        {props.event && (
          <Button variant="danger" onClick={props.removeEvent}>
            削除
          </Button>
        )}
        <Button variant="primary" onClick={registerSchedule}>
          {props.event ? '更新' : '追加'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
