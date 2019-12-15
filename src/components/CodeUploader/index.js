import React from 'react';

class CodeUploader extends React.Component {
    render () {
        return <div>
            <form action="/upload" method="post" name="upload">
                <div>
                    title:
                    <input name="title"></input>
                </div>
                <div>
                    domain:
                    <input name="domain"></input>
                </div>
                <div>
                    code:
                    <textarea name="code">
                        {"<html><h1>Hello, world!</h1></html>"}
                    </textarea>
                </div>
                <div>
                    <button type="submit">submit</button>
                </div>
            </form>
        </div>
    }
}

export default CodeUploader;