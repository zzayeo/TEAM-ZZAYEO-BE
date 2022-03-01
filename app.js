const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('서버가 3000포트로 요청을 받을 준비가 됐어요');
});

module.exports = app;
