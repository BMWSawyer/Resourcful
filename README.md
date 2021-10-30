RESOURCFUL
=========

Welcome to RESOURCFUL, the best place to search, add, and manage all of your personal online resources.

Search, view details and navigate to external URLs as a guest, or sign up for a full account and begin populating 'My Resources' with all your favourite resources from RESOURCFUL, or add your own by adding a URL, editing and saving the resource details.

RESOURCFUL allows you to like, rate and comment on any resource, and also update and save changes to your user profile, including your name and email address. 

## Views

### Home View
!["Home View"](https://github.com/BMWSawyer/MidtermProject-ResourceWall/blob/master/imgs/home.jpg)

### Sign Up View
!["Sign Up View"](https://github.com/BMWSawyer/MidtermProject-ResourceWall/blob/master/imgs/sign-up.jpg)

### Search View
!["Search View"](https://github.com/BMWSawyer/MidtermProject-ResourceWall/blob/master/imgs/search.jpg)

### Add/Edit Resource View
!["Add/Edit Resource View"](https://github.com/BMWSawyer/MidtermProject-ResourceWall/blob/master/imgs/add-edit.jpg)

### My Resources - Topics View
!["My Resources - Topics View"](https://github.com/BMWSawyer/MidtermProject-ResourceWall/blob/master/imgs/my-resources-topics.jpg)

### Profile View
!["Profile View"](https://github.com/BMWSawyer/MidtermProject-ResourceWall/blob/master/imgs/profile.jpg)


## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder and run schema and seed files 
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/resources/search`
9. Explore and have fun!

## Future Development

Future planned developments and known bugs include the following:
1. Deleting resources
2. Editing categories
3. Sharing resources via integration with social media platforms

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- Express
- bcrypt 5.0.1
- cookie-session 1.4.0 or above
- pg 8.5.0 or above
- bootstrap-icons 1.6.1 or above
- chalk 2.4.2
- crypto 1.0.1 or above
- dotenv 2.0.0
- ejs 2.6.2
- moment 2.29.1 or above
- morgan 1.9.1 or above
- pg-native 3.0.0 or above
- salt 0.5.5 or above
- sass 1.35.1 or above
