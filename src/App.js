import CodeUploader from './components/CodeUploader';

import Home from './page/Home';
import KNS from './page/KNS';
import Lambda from './page/Lambda';
import Decentral from './page/Decentral';
import ToDashboard from './page/ToDashboard';

const { BrowserRouter, Route, Link, Prompt, Switch, Redirect } = window.ReactRouterDOM;
const { CSSTransition } = window.ReactTransitionGroup;
const { Container } = window.ReactBootstrap;

const routes = [
    { path: '/', name: 'Home', Component: Home },
    { path: '/decentral', name: 'Decentral', Component: Decentral },
    { path: '/kns', name: 'KNS', Component: KNS },
    { path: '/lambda', name: 'Lambda', Component: Lambda },
    { path: '/todashboard', name: 'ToDashboard', Component: ToDashboard },
]

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                    <header className="masthead mb-auto">
                        <div className="inner">
                            <h3 className="masthead-brand">Exit Plan</h3>
                        </div>
                    </header>
                    <main role="main" className="container">
                        {routes.map(({ path, Component }) => (
                            <Route key={path} exact path={path}>
                                {({ match }) => (
                                    <CSSTransition
                                        in={match != null}
                                        timeout={300}
                                        classNames="page"
                                        unmountOnExit
                                    >
                                        <div className="page">
                                            <Component />
                                        </div>
                                    </CSSTransition>
                                )}
                            </Route>
                        ))}
                    </main>
                    <footer className="mt-auto">
                        <div className="inner">
                            <p>By Exit Plan team</p>
                        </div>
                    </footer>
                </div>
            </BrowserRouter>
        );
    }
}