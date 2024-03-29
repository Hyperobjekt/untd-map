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
npm install @hyperobjekt/untd-map
```

You can then import any components into your project.

```jsx
import { Header } from '@hyperobjekt/untd-map'

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

1. Increment the package version in `package.json` and add details to `CHANGELOG.md`.
2. Commit that change:
   `git add * ; git commit -a -m 'Update package version to [version]'`.
3. Run `npm publish`. This builds two versions of the
   javascript library and the demo files. The libraries are
   pushed up to NPM's repository.

Once the update is published, go to the repo where the package is in use and update it there (e.g. `untd-site`):

```
npm install @hyperobjekt/untd-map@{VERSION}
```

## Contributing

1. To contribute, check out a new branch off of the `development`
   branch.
2. When you have finished, submit your changes as a pull
   request relative to the `development` branch.

## Implementation Details

- Base components:
  [reactstrap](https://reactstrap.github.io/)
- State management:
  [zustand](https://github.com/react-spring/zustand)
  - manage state using a store for each module that need to
    share state between components

## Updating data

This app draws data files from the
[Child Poverty Action Lab Social Mobility github repository](https://github.com/childpovertyactionlab/Social-Mobility).
Use the branches in that repository to roll out data updates
across a series of staging and production sites:

1. The `testing` branch of the Social Mobility dataset is
   loaded here: https://hyperobjekt.github.io/untd-map/
2. The `staging` branch of the Social Mobility dataset is
   loaded here: https://staging--socialmobility.netlify.app/
3. The `production` branch of the Social Mobility dataset is
   loaded here: https://socialmobility.netlify.app/

To test updates to the dataset (:microscope: and make sure
they don't break the app :fire:), follow these steps:

1. Make your changes to `development`.

```bash
git add *
git commit -a -m 'Blah updates'
git push origin development
```

2. Check out `testing` and merge `development` into `testing`.
   Push `testing` back to origin.

```bash
git checkout testing
git merge master
git push origin testing
```

3. Check https://hyperobjekt.github.io/untd-map/ to make
   sure nothing has broken in the app. Test the features
   (tooltips, filtering, layer selection) and verify that
   all of the choropleths and point features are still
   displayed and filtered correctly.
4. Repeat for the subsequent branches, moving changes to
   `staging`, testing the staging instance of the app, then
   moving changes to `production` and testing once again.

## Configuration

The following values must be provided in a `.env` file when
the application builds:

```
GATSBY_MAPBOX_USER= # Mapbox account username
GATSBY_MAPBOX_API_TOKEN= # Mapbox api token with appropriate (read-only) permissions
GATSBY_NODE_ENV= # Not used by the app
GATSBY_DATA_ENDPOINT= # AWS endpoint for data, no slash at end
GATSBY_DATA_BRANCH= # Which branch of the client's repo is used loaded into the app, testing, staging, or production
GATSBY_SHOW_DATA_ISSUES= # 1 or 0, display data issues in the UI (1), or log to the console (0 or unset)
```
