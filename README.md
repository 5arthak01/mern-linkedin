# MERN Stack Boilerplate

## Seeding the DB

seed_jobs and seed_users contain jsons that can be sent to appropriate api routes for creation

## Installations

### Node

- For Linux:

```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- For Mac:

```
brew install node
```

### MongoDB

Install the community edition [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials).

### React

```
npm install -g create-react-app
```

## Running the boilerplate

- Run Mongo daemon:

```
sudo mongod
```

Mongo will be running on port 27017.

- Run Express Backend:

```
cd backend/
npm install
npm start
```

- Run React Frontend:

```
cd frontend
npm install/
npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser.
