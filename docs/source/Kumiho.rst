
========
Kumiho
========

``Kumiho`` 는 Klaytn 기반의 분산화된 웹 어플리케이션 플랫폼입니다.
Kumiho는 Chrome, Firefox를 지원하며 Browser Extension을 설치하면 사용할 수 있습니다.

- Chrome_
- Firefox_

.. _Chrome: https://chrome.google.com/webstore/category/extensions
.. _Firefox: https://addons.mozilla.org/ko/firefox/extensions/

.. note::
    Kumiho는 :ref:`Foxfire<Foxfire>` Extension과 Kaikas 지갑이 설치되어있어야 동작합니다.

새로운 웹 애플리케이션을 배포하고 싶다면 http://kumiho.klay/enroll_domain 에서 도메인을 등록 후 가능합니다.

------------------------------------------------------------------------------

Deploy Web Application
=============
1. http://kumiho.klay/enroll_domain 에서 원하는 도메인을 구입합니다. sub 도메인은 현재 지원하지 않으며 .klay로 끝나야 합니다.
2. 도메인을 구입 후 http://kumiho.klay/dashboard 에서 현재 Kaikas의 계정으로 등록된 도메인을 관리할 수 있습니다.
3. 도메인 관리 페이지에서 + Add Web Page를 선택하여 Path에 웹페이지를 등록하거나 + Add Api를 선택하여 Path에 solidity 함수를 등록 할 수 있습니다.

------------------------------------------------------------------------------

Web Page
=============
접근성은 블록체인의 대중화에 있어 가장 큰 장애물입니다. 많은 블록체인 플랫폼들이 존재하지만 독자적인 네트워크를 생성하고 있고 접근이 쉽지않아 사용이 힘들어 대중화되지 못하고 있습니다.

웹은 접근성이 매우 좋은 인터페이스입니다. 많은 컴퓨터는 인터넷에 연결돼있고 대부분의 컴퓨터에는 웹브라우저가 설치되어있습니다.

단순히 HTML코드를 블럭체인상에 업로드하는 것 만으로는 일반적인 방법으로는 접근이 불가능하기에 우리는 블록체인상의 HTML코드를 로드할 수 있는 Browser Extension인 :ref:`Foxfire<Foxfire>` 를 제공합니다.

HTML코드는 Reversed Linked List 형태로 Klaytn Blockchain 위에 업로드 됩니다. Foxfire는 설치된 사용자가 .klay 도메인에 접속하면 Kumiho의 백엔드인 :ref:`Ninetales<Ninetales>` 에서 웹 페이지를 블록체인 상에서 로드할 Webloader를 받아옵니다. Webloader는 현재 접속한 domain을 보고 로드해야 할 HTML을 담고있는 smart contract의 시작 주소를 Ninetales로 부터 받아옵니다.

.. code-block:: solidity

    pragma solidity >=0.4.25 <0.6.0;

    contract CodeFrag {
        address prevContract;
        string codeFrag;
        string format;
        string version;
        constructor (address _prevContract, string memory _codeFrag, string memory _format) public {
            prevContract = _prevContract;
            codeFrag = _codeFrag;
            format = _format;
            version = "0.0.1";
        }

        function getVersion () public view returns(string memory) {
            return version;
        }

        function getCodeFragment () public view returns(address, string memory, string memory) {
            return (prevContract, codeFrag, format);
        }
    }

모든 HTML코드가 로드되면 Webloader는 DOM을 조립 후 현재 페이지에 표시합니다.

.. warning::
    ``Foxfire``, ``Ninetales`` 는 실제 contract상에 올라간 코드를 로드하지 않습니다. 실제 코드는 Foxfire가 Ninetale에서 받아온 Webloader가 로컬에서 로드합니다. 아래와 같은 코드는 동작하지 않습니다.

    .. code-block:: HTML
    
        <script src="http://kumiho.klay/script.js">
        <style href="http://kumiho.klay/style.css">

    .. code-block:: javascript
    
        fetch('http://kumiho.klay/');
    
    그러므로 web application을 작성할때 Webpack과 같은 도구로 하나의 페이지로 bundling해야 하며 용량이 커지는 것을 막기위해 라이브러리나 이미지들은 CDN을 사용하는 것을 추천합니다.

    Kumiho의 홍보용 Application인 Redistribution_ 의 코드를 참고해 주시기 바랍니다.

    .. _Redistribution: https://github.com/KumihoProject/Redistribution

.. note::
    위와 같은 이유로 Single Page Application으로 작성하는 것을 권장합니다. 하지만 SPA로 작성 시 애플리케이션의 일부 페이지를 업데이트 해야 할 경우 전체를 다시 업로드 해야하기 때문에 경로를 나누어 업로드 하는 것을 고려할 수 있습니다.
    
    예를들어 ``/`` 와 ``/dashboard`` 를 각각의 SPA로 업로드 하는 것입니다.

--------------------------------------------------------------------------

Api
=============
Api는 Kumiho 플랫폼에서 Serverless Web Application을 구현하기 위한 핵심입니다. 웹페이지는 CDN으로 제공할 수 있지만 일반적인 웹 어플리케이션은 보안이나 사용자의 입력검증, 데이터베이스의 필요성 등으로 인해 사용자의 요청을 처리할 서버가 필요합니다.

EVM은 그 자체로 컴퓨팅 플랫폼이기 때문에 연산이 가능하지만 실제 웹과 상호작용하기는 매우 힘듭니다. Caver를 통해 직접 smart contract와 상호작용 할 수는 있지만 이러한 경우 smart contract의 버전업이 매우 고통스러운 작업이 됩니다. Kumino는 기존의 rest api와 유사한 인터페이스를 제공함으로써 사용과 관리가 편한 api 사용 환경을 제공해줍니다.

:ref:`Ahri<Ahri>` SDK를 통하여 api 호출을 요청하면 Ahri는 Ninetales로부터 실제 api의 인터페이스를 담고있는 smart contract의 주소를 받아와 호출할 smart contract function의 정보를 조합합니다.

.. code-block:: solidity

    pragma solidity >=0.4.25 <0.6.0;

    contract KumihoInterface {
        address contractAddress;
        string functionName;
        string parameters;
        string result;
        constructor (address _contractAddress, string memory _functionName, string memory _parameters, string memory _result) public {
            contractAddress = _contractAddress;
            functionName = _functionName;
            parameters = _parameters;
            result = _result;
        }
        function getFunctionMeta () public view returns(address, string memory, string memory, string memory) {
            return (contractAddress, functionName, parameters, result);
        }
    }

호출할 함수의 abi를 계산하여 실제 연산을 할 function을 호출하고 그것의 결과값을 반환합니다.