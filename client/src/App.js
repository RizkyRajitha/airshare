import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from "./pages/home/home";
import Signup from "./pages/signup/signup";
import Dashboard from "./pages/dashboard/dashboard";
import Landingpage from "./pages/landingpage/landingpage";
import Login from "./pages/login/login";
import Forgotpassword from "./pages/forgotpassword/forgotpassword";
import Templogin from "./pages/templogin/templogin";
import Dashboardlite from "./pages/dashboardlite/dashboardlite";
import Resetpassword from "./pages/resetpassword/resetpassword";
import Privacypolicy from "./pages/privacy/privacy";
// import "./app.css";

class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Landingpage} />
          <Route path="/home" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/forgotpassword" component={Forgotpassword} />
          <Route path="/signup" component={Signup} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/dashboardlite" component={Dashboardlite} />
          <Route path="/guestlogin" component={Templogin} />
          <Route path="/privacypolicy" component={Privacypolicy} />
          <Route path="/resetpassword/:id" component={Resetpassword} />
        </Switch>
      </Router>
    );
  }
}

export default App;
