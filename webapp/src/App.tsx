import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from 'page/home';

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  </Router>
);

export default App;
