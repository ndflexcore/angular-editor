### Linking
First in the package folder, where package.json resides:
`npm link`  
Then in the consumer project:  
`npm link @ndflexcore/angular-editor`

### Unlinking
> NOTE: order is important

First, in the consumer project:
`npm unlink --no-save @ndflexcore/angular-editor`  
Second, in the package folder:  
`npm unlink`

> Unlink before publishing the package
