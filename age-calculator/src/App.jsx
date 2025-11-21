import { useState } from 'react';
import './App.css';

function App() {
  // Standard Mode Inputs (Date of Birth)
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  // Reverse Mode Input (Age)
  const [ageInput, setAgeInput] = useState('');
  
  // State to control the mode
  const [isReverse, setIsReverse] = useState(false); // false = Age Calc, true = Birth Year Calc
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Toggle between Standard and Reverse modes
  const toggleMode = () => {
    setIsReverse(!isReverse);
    resetCalculator();
  };

  const calculate = () => {
    setError('');
    const today = new Date();

    // --- MODE 1: BIRTH YEAR CALCULATOR (Input: Age -> Output: Year) ---
    if (isReverse) {
      if (!ageInput) {
        setError('Please enter your age.');
        return;
      }
      
      // We can only accurately calculate the YEAR based on age alone
      const currentYear = today.getFullYear();
      const calculatedYear = currentYear - parseInt(ageInput);

      setResult({
        type: 'yearOnly', 
        text: calculatedYear
      });
      return;
    } 

    // --- MODE 2: AGE CALCULATOR (Input: Date -> Output: Age) ---
    if (!day || !month || !year) {
      setError('Please fill in all fields.');
      return;
    }

    const birthDateObj = new Date(year, month - 1, day);
    
    // Validation: Check if the date is real (e.g., prevents Feb 31st)
    if (
      birthDateObj.getDate() !== parseInt(day) ||
      birthDateObj.getMonth() !== parseInt(month) - 1 ||
      birthDateObj.getFullYear() !== parseInt(year)
    ) {
      setError('Must be a valid date.');
      return;
    }

    // Validation: Check if date is in the future
    if (birthDateObj > today) {
      setError('Date must be in the past.');
      return;
    }

    // Calculate exact age
    let years = today.getFullYear() - birthDateObj.getFullYear();
    let months = today.getMonth() - birthDateObj.getMonth();
    let days = today.getDate() - birthDateObj.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += previousMonth.getDate();
      months--;
    }

    setResult({ type: 'age', years, months, days });
  };

  const resetCalculator = () => {
    setDay('');
    setMonth('');
    setYear('');
    setAgeInput('');
    setResult(null);
    setError('');
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header-row">
            <h1>{isReverse ? 'Birth Year Calc' : 'Age Calculator'}</h1>
            <button className="toggle-btn" onClick={toggleMode}>
                {isReverse ? 'Switch to Standard' : 'Switch to Reverse'}
            </button>
        </div>

        <p>{isReverse ? 'Enter your age to find your birth year' : 'Enter your date of birth'}</p>
        
        <div className="input-row">
          {isReverse ? (
            // --- SINGLE INPUT FOR REVERSE MODE ---
            <div className="input-group full-width">
              <label>Age (Years)</label>
              <input 
                type="number" 
                placeholder="e.g. 30" 
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)} 
              />
            </div>
          ) : (
            // --- THREE INPUTS FOR STANDARD MODE ---
            <>
              <div className="input-group">
                <label>Day</label>
                <input 
                  type="number" 
                  placeholder="DD" 
                  value={day}
                  onChange={(e) => setDay(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Month</label>
                <input 
                  type="number" 
                  placeholder="MM" 
                  value={month}
                  onChange={(e) => setMonth(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Year</label>
                <input 
                  type="number" 
                  placeholder="YYYY" 
                  value={year}
                  onChange={(e) => setYear(e.target.value)} 
                />
              </div>
            </>
          )}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button className="calc-btn" onClick={calculate}>
          <span className="icon">➜</span>
        </button>

        {result && (
          <div className="result">
            {/* Standard Mode Result */}
            {result.type === 'age' && (
              <>
                <div className="result-line"><span>{result.years}</span> years</div>
                <div className="result-line"><span>{result.months}</span> months</div>
                <div className="result-line"><span>{result.days}</span> days</div>
              </>
            )}

            {/* Reverse Mode Result (Year Only) */}
            {result.type === 'yearOnly' && (
              <div className="result-line date-result">
                <p className="sub-text">You were born in:</p>
                <span className="highlight-text">{result.text}</span>
              </div>
            )}
            
            <button className="reset-btn" onClick={resetCalculator}>Reset</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;