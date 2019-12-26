import CodeUploader from './components/CodeUploader';

import Home from './page/Home';
import About from './page/About';

const { BrowserRouter, Route, Link, Prompt, Switch, Redirect } = window.ReactRouterDOM;

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <>          
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/about">
                            <About />
                        </Route>
                    </Switch>
                </>
            </BrowserRouter>
        );
    }
}