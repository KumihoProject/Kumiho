import CodeUploader from '../components/CodeUploader';
const { Link } = window.ReactRouterDOM;

class Home extends React.Component {
  render() {
    return <div role="main">
      <h1 className="cover-heading">Exit Plan</h1>
      <p className="lead">완전히 탈중앙화된 웹 어플리케이션.</p>
      <p className="lead">
        <Link to="/decentral" className="btn btn-lg btn-secondary">시작하기</Link>
      </p>
    </div>
  }
}

export default Home;