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
Without spinning up your own MongoDB and Girder instances, you can run your own admin panel connected to our development database ([api.mindlogger.info](api.mindlogger.info)). See [the instructions above](#your-own-database-1) to have full control of your database.

1. ```sh
   npm install
   ```
2. ```sh
   npm start
   ```
3. Visit [localhost:3000](localhost:3000)

### Links:
* [develoment admin panel (app.mindlogger.info)](https://app.mindlogger.info)
* [development admin panel (childmind-admin-staging.herokuapp.com)](https://childmind-admin-staging.herokuapp.com)
* [database (api.mindlogger.info)](https://api.mindlogger.info)
