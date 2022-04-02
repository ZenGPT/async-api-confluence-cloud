# development

## Local development

```bash
# npmm run start:sit
```
Or
```bash
# Start static react server at 3000
npm run start:react
# Start cloudflare proxy and point to localhost:5000
cloudflared --hostname air.zenuml.com --url http://localhost:5000
# Start atalssian connect server at localhost:5000
npm start
```

## Release
Push to the main branch. GitHub action will deploy it to firebase hosting
and functions.

# Errors
## babel-loader conflicts

https://github.com/storybookjs/storybook/issues/5183

