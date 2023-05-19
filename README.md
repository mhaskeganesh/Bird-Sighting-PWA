# Bird Sighting App
Allows bird watchers to record and view their bird sightings.

## Setup
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server
4. In case you need to run in development mode, run `npm run dev` instead
5. Have `MongoDB` installed and running on your machine on `localhost:27017`


## Tools
- Node.js (version > 14)
- Express (Version 4.16)
- Bootstrap (version 5)
- Sass (1.62.1)

## Technical Implementation
- `express` is used to serve files to the browser
- `sass` has been used to compile sass to css
- Precompilers has been used to optimise the build of css
  - `autoprefixer` - Enhanced Browser support
  - `cssnano` - Minify CSS
- `nodemon` has been used to watch for changes in the files and restart the server in `dev` mode
- `eslint` has been used to lint the code
- `prettier` has been used to format the code
- `mongoose` has been used to connect to the database
- `socket.io` has been used to implement real time chat updates
