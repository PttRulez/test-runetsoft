import ReactPortal from './ReactPortal';
import { useRef } from 'react';

const Modal = ({ children, hideModal }) => {
  const ref=useRef()
  const handleClick = ((e) => {
    if (e.target === e.currentTarget) {
      hideModal();
    }  
  })

  return (
    <ReactPortal wrapperId='portal'>
      <div className='modal' onClick={handleClick} ref={ref}>
        {children}
      </div>
    </ReactPortal>
  );
};

export default Modal;
