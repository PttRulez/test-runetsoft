import FunctionsIcon from '@mui/icons-material/Functions';
import DeleteIcon from '@mui/icons-material/Delete';
import Formula from './Formula';
import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';

const getFormulasFromLocalStorage = () => JSON.parse(localStorage.getItem('formulas'));

const initialFormulas = localStorage.getItem('formulas')
  ? getFormulasFromLocalStorage()
  : [
      ['x', '+', '2', 'y', '*', '2'],
      ['(', 'x', '-', '2', ')', '/', '3'],
    ];

function App() {
  const formulasInLS = useRef(
    initialFormulas
      .map(f => f.join(''))
      .join('')
  );
  const [formulaToEdit, setFormulaToEdit] = useState(null);
  const [formulas, setFormulas] = useState(initialFormulas);
  const [saveDisabled, setSaveDisabled] = useState(true);

  const editFormula = (index, formula) => {
    setFormulaToEdit({ index, formula });
  };

  const finishEditing = (index, formula) => {
    const newFormulas = [...formulas];
    newFormulas.splice(index, 1, formula);
    setFormulas(newFormulas);
  };

  const saveFormulas = e => {
    localStorage.setItem('formulas', JSON.stringify(formulas));
    formulasInLS.current = formulas.map(f => f.join('')).join('');
    setSaveDisabled(true);
  };

  const deleteFormula = (idx) => {
    const arr = [...formulas];
    arr.splice(idx,1);
    setFormulas(arr);
  }

  const addFormula = () => {
    setFormulas([...formulas, []]);
  };

  useEffect(() => {
    if (formulas.some(f => f.length === 0)) return;

    if (formulas.map(f => f.join('')).join('') !== formulasInLS.current) {
      setSaveDisabled(false);
    } else {
      setSaveDisabled(true);
    }
  }, [formulas]);

  return (
    <>
      <div className='wrapper'>
        <div className='save-buttons'>
          <button
            className='transparent-button'
            onClick={() => setFormulas(getFormulasFromLocalStorage)}
          >
            Отмена
          </button>
          <button className='blue-button' onClick={saveFormulas} disabled={saveDisabled}>
            Сохранить
          </button>
        </div>
        <div className='add-wrapper'>
          <h3>Настройка формул</h3>
          <button className='transparent-button' onClick={() => addFormula()}>
            + Добавить формулу
          </button>
        </div>

        <hr />

        <table>
          <thead>
            <tr>
              <th>Формула</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {formulas.map((formula, idx) => {
              return (
                <tr key={idx}>
                  <td>{formula.join(' ')}</td>
                  <td className='action-buttons'>
                    <button className='trash-button'>
                      <DeleteIcon onClick={() => deleteFormula(idx)}/>
                    </button>
                    <button className='formula-button' onClick={() => editFormula(idx, formula)}>
                      <FunctionsIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {formulaToEdit && (
        <Modal hideModal={() => setFormulaToEdit(null)}>
          <Formula
            close={() => setFormulaToEdit(null)}
            formulaToEdit={formulaToEdit}
            finishEditing={finishEditing}
          ></Formula>
        </Modal>
      )}
    </>
  );
}

export default App;
