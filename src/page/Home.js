import CodeUploader from '../components/CodeUploader';
const {Link} = window.ReactRouterDOM;

class Home extends React.Component {
    render () {
        return <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="masthead mb-auto">
          <div className="inner">
            <h3 className="masthead-brand">Exit Plan</h3>
          </div>
        </header>
      
        <main role="main" className="inner cover">
          <h1 className="cover-heading">Exit Plan</h1>
          <p className="lead">완전히 탈중앙화된 웹 어플리케이션, 여기서부터.</p>
          <p className="lead">
            <a href="#" className="btn btn-lg btn-secondary">시작하기</a>
          </p>
        </main>
      
        <footer className="mastfoot mt-auto">
          <div className="inner">
            <p>By Exit Plan team</p>
          </div>
        </footer>
      </div>
    }
}

export default Home;