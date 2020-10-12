# How-To Publish

### Login in first
`npm login`  
use your creds

### Publish
Do these steps as follows:
* increment `version` in `projects/angular-editor/package.json`  
* `build:lib`
* `publish:lib`

or their content as described in `package.json`

> **important**  
>do not forget `--access=public`, otherwise you'll get `402 Payment Required ` 
