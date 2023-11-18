import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Orders from "./components/Orders/Orders";
import Customers from "./components/Customers/Customers";
import CustomerDetails from "./components/Customers/CustomerDetails";
import Navbar from "./components/Navbar";

import './App.css';

function App(): JSX.Element {

  return (
    <div className="App">
      <Navbar />
      <Router>
        <Switch>
          <Route path="/orders" component={Orders} />
          <Route path="/customers/:customerId" component={CustomerDetails} />
          <Route path="/" component={Customers} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;