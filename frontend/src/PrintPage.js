import { useNavigate } from 'react-router-dom';

export default function PrintPage() {
    return (
      <div>
        <h1 className="title">This will be the final report with a print</h1>
        <PrintButton/>
        <MainScreenButton/>
      </div>
    );
}

function PrintButton(){
    return (
      <button type="button" className="submit-button" onClick={() => window.print()}>
        Print Report
      </button>
    );
}

function MainScreenButton(){
    const navigate = useNavigate();
    return (
      <button type="button" className="my-button" onClick={() => navigate('/') }>
        Back to Main Screen
      </button>
    );
}
