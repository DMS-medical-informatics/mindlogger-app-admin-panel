#### Features:
* Login/Logout Functionality
* Simple Boostrap UI

### Prerequisites

#### Your own database
- [MongoDB](https://www.mongodb.com/)
- [Girder](https://girder.readthedocs.io)

#### All installations
- [Git](https://git-scm.com/downloads)
- [Node v10.11.0 & npm v6.4.1](https://github.com/creationix/nvm#user-content-usage)

### Instructions:
#### Your own database
1. Install the [prerequisites](#prerequisites).
2. Run MongoDB.
3. Run Girder on your running MongoDB instance.
4. [Set up an administrator account with Girder](https://girder.readthedocs.io/en/stable/installation.html#initial-setup).
5. Change the `API_HOST` variable [in `src/constants/index.js`](https://github.com/ChildMindInstitute/mindlogger-app-admin-panel/blob/9392b8de30db8b07f6abf94b80ef2979896ba499/src/constants/index.js#L1) to the URL of your running Girder instance.

#### Local admin panel
Without spinning up your own MongoDB and Girder instances, you can run your own admin panel connected to our development database ([api.mindlogger.info](api.mindlogger.info)). See [the instructions above](#your-own-database-1) to have full control of your database. Clone this repository, and run these shell commands in the top-level directory of your copy:

1. ```sh
   npm install
   ```
2. ```sh
   npm start
   ```
3. Visit [localhost:3000](localhost:3000)

## Contributing

1. Check [open issues](https://github.com/ChildMindInstitute/mindlogger-app-admin-panel/issues) for known issues and discussions.
2. If your issus is not already listed, add your issue, optionally with :octocat: [gitmoji](https://gitmoji.carloscuesta.me/).
3. Clone this repository.
4. If your issue already has a discussion, see if it has a branch. If so, checkout that branch before creating your own.
5. Create a new branch to work in.
6. When you're ready to submit your changes, [update the version](#versioning) and submit a pull request from your branch to the branch you branched from (ie, the branch you checked out in step 4 above or `master`).
7. One or more of the project developers will review your request and merge or request changes.

## Versioning

Use [Semantic Versioning 2.0.0](https://semver.org/#semantic-versioning-200). Always develop in a feature-specific branch and update the version (at least the patch version, but a higher-level version if appropriate) when submitting a pull request.

To increment a major or minor version, complete the relevant project board. Currently we're working on [v0.1](https://github.com/orgs/ChildMindInstitute/projects/6). [v0.2](https://github.com/orgs/ChildMindInstitute/projects/9) is on deck.

For this repository, the version exists in 1 place: [`package.json`](https://github.com/ChildMindInstitute/mindlogger-app-admin-panel/blob/12ccc155929cbd7b27f080ca566990d37b9ad9f4/package.json#L3)

### Links:
* [development admin panel (GitHub Pages)](https://ChildMindInstitute.github.io/mindlogger-app-admin-panel)
* [admin panel (app.mindlogger.info)](https://app.mindlogger.info)
* [development database (mindlogger-dev.vasegurt.com)](https://mindlogger-dev.vasegurt.com)
* [database (api.mindlogger.info)](https://api.mindlogger.info)
