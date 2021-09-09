import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Popup from "./Popup";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import SettingPage from "./settingPage";

function App() {
  
  return (
    <div className="container">
      <Router>
        <div>
          <Switch>
            <Route path="/setting">
              <SettingPage/>
            </Route>
            <Route path="/">
              <Popup />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
