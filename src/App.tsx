import { BrowserRouter, Switch, Route } from 'react-router-dom';
import "semantic-ui-css/semantic.min.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './core/apollo-client';
import AppDashboard from './components/AppDashboard';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
    <BrowserRouter basename="/">
      <Switch>
        <Route path="/signup">
          <Signup/>
        </Route>
        <Route path="/login">
          <Login/>
        </Route>
        <Route path="/app">
          <AppDashboard/>
        </Route>
      </Switch>
    </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
