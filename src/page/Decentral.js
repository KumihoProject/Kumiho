const { Link } = window.ReactRouterDOM;

function Decentral() {
    return (
        <div role="main">
            <h1 className="cover-heading">Decentralized Web Application</h1>
            <p>블록체인위에서 모든것을 탈중앙화해서</p>
            <Link to="/kns" className="btn btn-lg btn-secondary">다음</Link>
        </div>
    )
}

export default Decentral;