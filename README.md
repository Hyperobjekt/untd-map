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

## Updating schools data

The client supplies a CSV to us with all the schools data, and this data changes frequently. These are the steps required to switch out this data.

1. Download the CSV from the shared client folder.
2. [Convert it from CSV to JSON](https://csvjson.com/csv2json). Select the minify option. Download the converted JSON file.
3. Files should be named as followed, ending with the `.json` extension.
  a. schools
  b. demotracts
  c. districts
  e. feeders
  f. redlines
4. Files are uploaded to an AWS s3 bucket. There are 3 folders in the bucket, for 3 different environments. This allows us to upload new data and test the new data before moving to staging and production: 
  a. development
  b. staging
  c. production
5. The app will call files from these different folders depending upon the `NODE_ENV` variable set in your dev or build environment.
