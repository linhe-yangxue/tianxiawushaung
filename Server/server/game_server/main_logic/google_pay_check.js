let _ = require('lodash');
const crypto = require('crypto');

function chunkSplit(paramString, paramLength, paramEnd = '\n') {
    let p = [];
    let s = paramString;
    while (s.length > paramLength) {
        let s1 = s.substr(0, paramLength);
        let s2 = s.substr(paramLength);
        s = s2;
        p.push(s1);
    }
    if (s.length > 0) {
        p.push(s);
    }
    p.push('');
    return p.join(paramEnd);
}

function GooglePlayCheck(params) {
    let verify = crypto.createVerify('RSA-SHA1');

    let PHP_EOL = '\n';
    let inappPurchaseData = '{"orderId":"","packageName":"","productId":"","purchaseTime":0,"purchaseState":0,"purchaseToken":""}';
    let googlePublicKey = '';
    let inappDataSignature = '';
    let publicKey = "-----BEGIN PUBLIC KEY-----" + PHP_EOL + chunkSplit(googlePublicKey, 64, PHP_EOL) + "-----END PUBLIC KEY-----";

    verify.update(inappPurchaseData);
    let r = verify.verify(publicKey, Buffer.from(inappDataSignature, 'base64')); //验证数据

    console.log(params + "-->rrrrrrrrrrr:", r);
}