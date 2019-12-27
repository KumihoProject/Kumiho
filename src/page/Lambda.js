const { useState } = window.React;
const { Link } = window.ReactRouterDOM;

function Lambda() {
    const [stage, setStage] = useState(false);
    return (
        <div role="main">
            <h1 className="cover-heading">Lambda</h1>
            <h2 className="lead">완전한 Serverless</h2>
            <p>블록체인 상에서 구동되는 Serverless Architecture</p>
            {
                !stage ? [<p>&nbsp;</p>,<a href='#' onClick={() => { setStage(true) }} className="btn btn-lg btn-secondary">다음</a>] :
                    [
                        <p>사용량 제한 없는 API</p>,
                        <Link to="/todashboard" className="btn btn-lg btn-secondary">다음</Link>
                    ]
            }

        </div>
    )
}

export default Lambda;