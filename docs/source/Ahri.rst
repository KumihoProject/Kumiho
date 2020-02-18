
====
Ahri
====

``Ahri`` 는 Kumiho 플랫폼을 사용하기 위한 SDK입니다. 

.. code-block:: javascript

    const Ahri = window.Ahri;

------------------------------------------------------------------------------


compileSolidity
=====================
.. code-block:: javascript

    async compileSolidity(solidity)

------------------------------------------------------------------------------


deployContract
=====================
.. code-block:: javascript

    async deployContract(abi, bin, args, options = {})

------------------------------------------------------------------------------


callByUrl
=====================
.. code-block:: javascript

    async callByUrl(url, method, args, value = 0, options = {})

------------------------------------------------------------------------------


callByAddress
=====================
.. code-block:: javascript

    async callByAddress(address, method, functionName, args, argTypes, resultTypes, value = 0, options = {})

------------------------------------------------------------------------------


fetch
=====================
.. code-block:: javascript

    async fetch(url, req = {})

------------------------------------------------------------------------------


getApiInterface
=====================
.. code-block:: javascript

    async getApiInterface(url)
