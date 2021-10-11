Included Certs created with:
`openssl req -new -newkey rsa:4096 -x509 -sha256 -out certificate.cer -keyout privkey.key -nodes`
NOTE: When using self-signed certs, sometimes the browser will be grumpy about it. For Chromium based browsers, this setting may be helpful for development and testong:  `chrome://flags/#allow-insecure-localhost`

Simple webserver (using Python's `http-server`):
`http-server -S -K ./sample_keys/private.key -C ./sample_keys/certificate.cer -p 8085`