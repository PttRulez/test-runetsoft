import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import InputNumber from './InputNumber';

const Formula = ({ close, formulaToEdit: { index: indexToEdit, formula: formulaToEdit }, finishEditing }) => {
  const [formula, setFormula] = useState();
  const [draggedValue, setDraggedValue] = useState(null);
  const operators = ['+', '-', '*', '/'];
  const brackets = ['(', ')'];
  const operands = ['Число', 'x', 'y', 'z'];
  const [isValid, setIsValid] = useState(true);

  const dragStart = async e => {
    setDraggedValue(e.target.innerText);
  };

  const dragDrop = async e => {
    e.preventDefault();
    e.stopPropagation();

    setFormula(prevFormula => [...prevFormula, draggedValue === 'Число' ? 0 : draggedValue]);
  };

  const isOperand = (value) => {
    if (operands.includes(value)) return true
    return !isNaN(value)
  }

  const checkValid = arr => {
    if (arr.length === 0) return false;
    if (operators.includes(arr.at(-1))) return false;

    const brackets = [];
    const openBrackets = '(';
    const closedBrackets = ')';

    for (let i = 0; i < arr.length; i++) {
      // Два знака подряд
      if (isOperand(arr[i]) && isOperand(arr[i - 1]) && i > 0) {
        return false;
      }

      // Две переменные подряд
      if (operators.includes(arr[i]) && operators.includes(arr[i - 1]) && i > 0) {
        return false;
      }

      // переменная сразу перед открывающимися или после закрывающихся
      if (
        (operands.includes(arr[i - 1]) && arr[i] === openBrackets) ||
        (operands.includes(arr[i]) && arr[i - 1] === closedBrackets)
      ) {
        return false;
      }

      //знак после открывающихся или перед закрывающимися
      if (
        (operators.includes(arr[i - 1]) && arr[i] === closedBrackets) ||
        (operators.includes(arr[i]) && arr[i - 1] === openBrackets)
      ) {
        return false;
      }

      //деление на ноль
      if(arr[i-1] === '/' && arr[i] === 0) {
        return false;
      }


      if (arr[i] === closedBrackets) {
        if (brackets.length === 0) {
          return false;
        }

        if (brackets.at(-1) === openBrackets) {
          brackets.pop();
        } else {
          brackets.push(arr[i]);
        }
      }
      if (arr[i] === openBrackets) {
        brackets.push(arr[i]);
      }
    }

    return brackets.length === 0;
  };

  const onSave = () => {
    finishEditing(indexToEdit, formula);
    close();
  };

  const deleteItem = index => {
    setFormula(prevFormula =>{
      const arr = [...prevFormula]
      arr.splice(index, 1)
      return arr;
    });
  };

  const changeInput = (idx, value) => {
    setFormula(prevFormula =>{
      const arr = [...prevFormula]
      arr[idx] = value;
      return arr;
    });
  }

  useEffect(() => {
    setFormula([...formulaToEdit]);
  }, []);

  useEffect(() => {
    if (!formula) return;

    setIsValid(checkValid(formula));
  }, [formula]);

  return (
    <div
      className='formula-window'
      onDragOver={e => {
        e.preventDefault();
      }}
    >
      <div className='formula-window-header'>
        <p>Задать формулу</p>
        <CloseIcon onClick={close} />
      </div>
      <div className='formula-constructor'>
        <div className='formula-operands'>
          {operands.map(text => (
            <div
              key={text}
              className='formula-item'
              draggable
              onDragStart={dragStart}
              onDrop={dragDrop}
            >
              {text}
            </div>
          ))}
        </div>
        <div className={'formula-area' + (!isValid ? ' not-valid' : '')} onDrop={dragDrop}>
          <div className='formula-wrapper'>
            {formula &&
              formula.map((value, idx) => {
                return (
                  <div className='formula-item' key={value + idx}>
                    {!isNaN(value) ? <InputNumber initValue={value} changedInput={changeInput} idx={idx} />: value}
                    <CloseIcon
                      onClick={() => deleteItem(idx)}
                      className='formula-item-delete'
                      color='warning'
                      fontSize='small'
                    />
                  </div>
                );
              })}
          </div>
        </div>
        <div className='formula-operators'>
          {[...operators, ...brackets].map(text => (
            <div
              key={text}
              className='formula-item'
              draggable
              onDragStart={dragStart}
              onDragEnter={e => e.preventDefault()}
              onDragLeave={e => e.preventDefault()}
              onDrop={dragDrop}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
      <div className='formula_buttons'>
        <button className='transparent-button' onClick={close}>
          Отмена
        </button>
        <button className='blue-button' disabled={!isValid} onClick={onSave}>
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default Formula;
