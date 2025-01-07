import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [courses, setCourses] = useState([]); // [state, setState

  useEffect(() => {
      getCourses();
  },[]);
  const getCourses = async () => {
    try {
      const response = await fetch("/tjena");
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      console.log(data);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  const redirect = () => {
    window.open("https://cloud.timeedit.net/ltu/web/schedule1/ri1Q7.html", "_blank")
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <table>

        </table>
      </header>
    </div>
  );
}

export default App;
