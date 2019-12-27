const { Link } = window.ReactRouterDOM;

function KNS() {
    return (
        <div role="main">
            <h1 className="cover-heading">Klaytn Name Service</h1>
            <p>Address에서 Human Readable한 주소로</p>
            <Link to="/lambda" className="btn btn-lg btn-secondary">다음</Link>
        </div>
    )
}

export default KNS;