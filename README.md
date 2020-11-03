# UNTD Map

## Getting Started

Run `npm install` to install required dependencies, then run
one of the following:

- `npm run start`: this starts the explorer and serves the
  explorer component from `/src/modules/untd/explorer`
- `npm run styleguide`: this starts the style guide which
  shows all components available in this repository, along
  with documentation and examples.

## Using components from this library

To use components from this library, first add the repo
using npm:

```
npm install git+ssh://git@github.com:Hyperobjekt/untd-map.git
```

You can then import any components into your project.

```jsx
import { Header } from 'untd-components'

function AppHeader() {
  return (
    <div className="page">
      <Header />
      <div className="body">Sample page</div>
    </div>
  )
}
```

## Publishing changes

This library can be published via NPM. 

1. Increment the package version in `package.json`. 
2. Commit that change: `git add * ; git commit -a -m 'Update package version to [version]'`.
2. Run `npm publish`. This builds two versions of the javascript library and the demo files. The libraries are pushed up to NPM's repository.
3. Commit the publish (so you don't dirty up your next working branch). `git add * && git commit -a -m 'Staging build'`.
4. Update the plugin in the site where you're using it: `git checkout -b update-explorer ; npm update untd-map`.
5. Commit that update, merge to master, and push. `git add * ; git commit -a -m 'Update untd-map' ; git checkout master ; git merge update-explorer ; git push origin master`

## Updating data

Several client-supplied data files are stored in s3 buckets. These files are loaded from different locations depending upon the `NODE_ENV`.

* `development`: These files are loaded for local development environments.
* `staging`: These file are are loaded by the app when staged at [https://hyperobjekt.github.io/untd-map](https://hyperobjekt.github.io/untd-map).
* `production`: These files are loaded by the app when loaded into the production environment.
