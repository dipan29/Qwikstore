<h1 align="center">🌺 QwikStore 🌺</h1>
<p align="center">A Simple and Quick Datastore API</p>

# Introduction
This is a simple API that allows you to create certain properties (in form of API Keys) under which you can create unlimited variables (aka entities) that can be fetched or updated via GET, PUT, POST methods from anywhere. The api is currently hosted at [Heroku](https://https://qwikstore.herokuapp.com/) that can be used as your public endpoint if you don't want to deploy your own instance. The followin section shows the available endpoints and the respective requests and responses. You can find below how to deploy your own instance if you wish to make one.

<hr/>

## Creating your Own Instance of QwikStore
Clone this repository to your local system to make the necessary changes and deploy it to your own instance.  

### 1. Create an MongoDB Atlas account.
Create and account at [MongoDB](https://account.mongodb.com/account) and sign in to that account.  
Once you are signed in, make a cluster as per your requirement (free tier will surely suffice for basic development or testing) and generate its connection uri.  
Allowlist ``0.0.0.0/0`` in the Network section so that your application can connect to the mongo instance.  

### 2. Create an Environment File
In the root of the project, create a new file named ``.env`` with your preferred text editor.  
Add the following to the file.  
<br/>
<code>
connection_uri = "mongodb+srv://username:password@your-cluster.uheun.mongodb.net/database?retryWrites=true&w=majority"<br/>
PORT = 5000<br/>
access_key = "a-random-access-key"
</code><br/><br/>
*Change the connection_uri to the provided connection uri and give a strong password as your access key. This access_key will allow you to list all the created entities*.  

### 3. Run your Local Deployment Server
Run the following commands inside the root folder of the project.  
``npm i``, and wait till the packages and dependencies are installed.  
To test the API enter ``npm run dev`` to start the local endpoint at ``http://localhost:5000/``.  
If you make any changes *nodemon* will notice as required and restart your application.  

### 4. Deploy to Heroku and create your own Public Endpoint
Create and account at [Heroku](https://heroku.com/) and after verification head on to [Create Deployment](https://heroku.com/deploy). Give a unique name and choose a region. Any region will work, but you may choose the region close to your location.  
Open Teriminal and enter the following -  
1. &nbsp;``heroku git:remote -a your-app-name``  
2. &nbsp;``git add --all && git commit -m "Deployment"``  
3. &nbsp;``heroku config:set connection_uri=mongodb-connection-uri access_key=your-access-key``
4. &nbsp;``git push heroku main``  
<br/>  

*Make sure to change your application name, mongodb connection uri and your access key.*  <br/>
Wait till the deployment is over and you will be ready to use it using the endpoint``https://your-app-name.hrokuapp.com``.

You deployment is ready. Every time you commit a change, run command 4 to update your public endpoint.
<hr/>

## API Documentation - Public API Endpoint
These are the available endpoints that are availabe in this application at the moment. Before getting started with the applicaition, you need to create an API Key to allow the API interactions. All the content-types are 'application/json'.

### 1. Creating an API Key [Important]
**POST** https://qwikstore.herokuapp.com/<span style="color: #27ae60">api/create/</span>  
This creates and API KEY based on the email address provided that is later used to identify the details.<br/>
**Parameters -**  
<code>
{<br/>
&nbsp;"owner": "your-email@example.com"<br/>
}
</code>  
**Response [200 OK] -**  
<code>
{<br/>
&nbsp;"message": "Success",<br/>
&nbsp;"api_key": "YOUR-APIKEY-1010",<br/>
&nbsp;"additional_text": "New API Key was created successfully. Do not lose this key. Store it in a safe place."<br/>
}
</code>
<br/>  

### 2. Delete Created API Key  
**POST** https://qwikstore.herokuapp.com/<span style="color: #27ae60">api/delete/</span>  
If you wish to delete your api key, this will also remove all the entities created under it, you can delete your key as follows.  
**Parameters -**  
<code>
{<br/>
&nbsp;"owner": "your-email@example.com",<br/>
&nbsp;"api_key": "YOUR-APIKEY-1010"<br/>
}
</code>  
<br/>

### 3. Create a New Entity or Update the Entity Type
**POST** https://qwikstore.herokuapp.com/<span style="color: #27ae60">create/</span>  
An entity is a variable storage or data-store that can store any type of data as specified during the time of its creation. This same route can be reused by passing the type to update the variable type.   
*Entity Names should not contain any white spaces or special characters*.  
**Parameters -**  
<code>
{<br/>
&nbsp;"api_key": "YOUR-APIKEY-1010",<br/>
&nbsp;"entity": "your-entity-name",<br/>
&nbsp;"content": "initial-value",<br/>
&nbsp;*"type": "[Optional Parameter], Accepted Values - number, string, boolean"*<br/>
}
</code>  
**Response - [200 OK]**  
<code>
{<br/>
&nbsp;"message": "Accepted",<br/>
&nbsp;"additional_text": "New Entity has been successfully created.",<br/>
&nbsp;"entity": "your-entity-name"<br/>
}
</code>
<br/>

### 4. Retrive Value of an Entity
**GET** https://qwikstore.herokuapp.com/<span style="color: #d35400">api-key/entity-name/</span>  
This GET Method returns the current state or contents of the entity in the ``response.body [200 OK]``.
<br/>

**POST** https://qwikstore.herokuapp.com/<span style="color: #27ae60">content/</span>  
You can also get the value via a POST Method as defined below.  
**Parameters -**  
<code>
{<br/>
&nbsp;"api_key": "YOUR-APIKEY-1010",<br/>
&nbsp;"entity": "your-entity-name"<br/>
}
</code>  
The request returns the current state or contents of the entity in the ``response.body [200 OK]``.
<br/>

### 5. Setting the Content of an Entity
**POST** https://qwikstore.herokuapp.com/<span style="color: #27ae60">set/</span>   
This method permits the update of the entity provided that the type remains the same. To check the type you can use the option parameter in the ``/create`` (Endpoint No. 3) route.  
**Parameters -**  
<code>
{<br/>
&nbsp;"api_key": "YOUR-APIKEY-1010",<br/>
&nbsp;"entity": "your-entity-name",<br/>
&nbsp;"content": "Content - number, string or boolean"<br/>
}
</code>  
*Make sure you don't use quotes for sending number or boolean values, else this will cause and error to fire up.*  
<br/>
**GET** https://qwikstore.herokuapp.com/<span style="color: #d35400">set/api-key/entity-name/content/</span>   
This will do the same as above and allows you to set the value of the existing entity under your API Key.  

<br/>

*Rest API Documentation will be added soon.*

<hr/>

## Contributions
Feel free to make your changes, bug-fixes or feature additions and make pull request to this repository. This project is completely open-source and you are free to modify, use or distribute it as-it-is or as required.

Creator Contact - [Dipan Roy](https://www.DipanRoy.com)