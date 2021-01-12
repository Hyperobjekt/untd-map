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

## Contributing

1. To contribute, check out a new branch off of the `master` branch.
2. When you have finished, submit your changes as a pull request relative to the `master` branch.

## Updating data

This app draws data files from the [Child Poverty Action Lab Social Mobility github repository](https://github.com/childpovertyactionlab/Social-Mobility). Use the branches in that repository to roll out data updates across a series of staging and production sites:

1. The `testing` branch of the Social Mobility dataset is loaded here: https://hyperobjekt.github.io/untd-map/
2. The `staging` branch of the Social Mobility dataset is loaded here: TBD Netlify
3. The `production` branch of the Social Mobility dataset is loaded here: TBD Netlify

To test updates to the dataset (and make sure they don't break the app ::fire::), follow these steps:

1. Make your changes to `master`.
```bash
git add *
git commit -a -m 'Blah updates'
git push origin master
```
2. Check out `testing` and merge `master` into `testing`. Push `testing` back to origin.
```bash
git checkout testing
git merge master
git push origin testing
```
3. Check https://hyperobjekt.github.io/untd-map/ to make sure nothing has broken in the app. Test the features (tooltips, filtering, layer selection) and verify that all of the choropleths and point features are still displayed and filtered correctly.
4. Repeat for the subsequent branches.
