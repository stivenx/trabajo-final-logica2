import React, { useState, useEffect, useCallback } from "react";

const Prueba = () => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operador, setOperador] = useState("");
  const [result, setResult] = useState(null);
 
  
  const calcular = (operador) => {
    let n1 = parseFloat(num1);
    let n2 = parseFloat(num2);
  
    // Validar que se ingresaron números válidos
    if (isNaN(n1) || isNaN(n2)) {
      alert("Debes ingresar ambos números.");
      return;
    }
  
    switch (operador) {
      case "suma":
        if (n1 <= 0 || n2 <= 0) {
          alert("Debes ingresar dos números mayores a 0");
          setResult(0);
        } else {
          setResult(n1 + n2);
        }
        break;
      case "resta":
        if (n2 >= n1) {
          alert("El segundo número debe ser menor al primero");
          setResult(0);
        } else {
          setResult(n1 - n2);
        }
        break;
      case "multiplicacion":
        if (n1 <= 0 || n2 <= 0) {
          alert("Debes ingresar dos números mayores a 0");
          setResult(0);
        } else {
          setResult(n1 * n2);
        }
        break;
      case "division":
        if (n2 === 0) {
          alert("No se puede dividir por cero");
          setResult(0);
        } else {
          setResult(n1 / n2);
        }
        break;
      default:
        alert("Debes seleccionar un operador válido");
        setResult(0);
        break;
    }
  };
  

  return (
    <div>
      <input
        type="number"
        placeholder="Primer número"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
      />
      <input
        type="number"
        placeholder="Segundo número"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
      />
      <select value={operador} onChange={(e) => setOperador(e.target.value)}>
        <option value="">Selecciona una operación</option>
        <option value="suma">Suma</option>
        <option value="resta">Resta</option>
        <option value="multiplicacion">Multiplicación</option>
        <option value="division">División</option>
      </select>

      <button onClick={() =>  calcular(operador)}>Calcular</button>

      {result !== null && <p>Resultado: {result}</p>}
    </div>
  );
};

export default Prueba;
