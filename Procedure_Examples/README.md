
## SDK Usage

## Procedure Development
Basics:
- Only Procedures written in Javascript are supported.
- Procedures must pass in an `input` object

### Procedure Deployment/Packaging
TODO:
- Quick index, with descriptions, of the examples
- Deployment instructions
    - maybe have a script to help?
    - Need to provide the encryption public key (in future version)
    - Basic overview (on Linux)
      - If any, embed secrets into code (or copy folder and embed - several ways to do this)
      - tgz folder (include node_modules)
        - tar -zcvf <filename>.tgz .
      - Delete secrets from code 
      - gpg new `.tgz` file with public key
      - IPFS add new `.gpg` file. Hash is your Procedure address
        - In the future, adding to IPFS will only work from an auth'd Trustack account on our IPFS network.