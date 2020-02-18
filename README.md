# Kumiho
kumiho project

## DOCS

### build docs
* local build
  ```bash
  cd docs/source
  make html
  ```
  
  run local docs server
  ```bash
  cd docs/build/html
  noup python3 -m http.server 8081 &
  ```
  http://kumiho.org:8081

* read the docs
  master branch 기준 푸시 시 자동 빌드

  https://kumiho.readthedocs.io/en/latest 
