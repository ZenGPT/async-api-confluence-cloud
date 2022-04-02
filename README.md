# development

## Local development

```bash
# npmm run start:sit
```
Or
```bash
# cd functions && npm run build:watch
# firebase emulators:start --only hosting,functions

// another terminal, start react and proxy to http://localhost:5000 for functions
#npm run start:react
# Start cloudflare proxy and point to devServer
cloudflared --hostname air.zenuml.com --url http://localhost:3000
```

### Editor

Go to localhost:3000/edit to open the editor.

## Release
Push to the main branch. GitHub action will deploy it to firebase hosting
and functions.

# Errors
## babel-loader conflicts

https://github.com/storybookjs/storybook/issues/5183

