import { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

function createWrapper(id) {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('id', id);
  document.body.appendChild(wrapper);
  return wrapper;
}

const ReactPortal = ({children, wrapperId = 'portal'}) => {
  const [wrapper, setWrapper] = useState(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let wrapperWasCreated = false;

    if(!element) {
      wrapperWasCreated = true;
      element = createWrapper(wrapperId);
    }
    setWrapper(element);

    return () => {
      if(wrapperWasCreated && element.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  }, [wrapperId])

  if (wrapper === null) return null;

  return createPortal(children, wrapper)
}

export default ReactPortal;