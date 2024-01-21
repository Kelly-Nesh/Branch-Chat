# CS Messaging Web App

This is a simple and scalable Branch customer service messaging web application.

# Table of Contents

<ol>
<li><h3><a href="#project">Project Requirements</a></h3></li>
    <ul>
     <li><h3><a href="#req-basic">Basic</a></h3></li>
     <li><h3><a href="#req-extended">Extended</a></h3></li>
    </ul>
<li><h3><a href="#description">Project Description</a></h3></li>
    <ul>
     <li><h3><a href="#technologies">Technologies</a></h3></li>
     <li><h3><a href="#desc">Description</a></h3></li>
    </ul>
<li><h3><a href="#features">Implemented Features</a></h3></li>
<li><h3><a href="#installation">Installation</a></h3></li>
</ol>

<h1 id="project">Project Requirements</h1>

<h2 id="req-basic">Basic Requirements</h2>

1. Allow a team of agents to respond to
   incoming messages from (potentially many) customers in a streamlined fashion.

   - The system should allow multiple agents can log in at the same time and respond to incoming messages.

2. The customer messages can be sent and received through an API endpoint which can be simulated via a simple web form or a postman collection.

3. Store CSV messages in a database of your choosing and they appear on the agents portal

   - Your application should provide a way to view and respond to these individual messages as well.

4. Host your application somewhere (your machine is fine as well!).

5. Record a video of your application’s functioning and follow it up with a small code walkthrough covering only the crucial aspects. Ensure that the video is not longer than 5 - 6 minutes.

<h2 id="req-extended">Extended features</h2>

1. Figure out a scheme to help agents divide work amongst themselves, and to prevent multiple agents working on the same message at once.

2. Explore ways to surface messages that are more urgent and in need of immediate attention.

   - For example, customers who are asking about the loan approval process or when their loan will be disbursed might have more urgency than those asking how to update information on their Branch account.

3. Implement search functionality to allow agents to search over incoming messages and/or customers

4. Explore ways to surface additional information about customers (e.g. external profiles or some internal information we have about them) in the UI, to provide context to agents.

5. Implement a canned message feature that allows agents to quickly respond to enquiries using a set of pre-configured stock messages.

6. Make the agent UI (and/or the customer-facing UI) more interactive by leveraging websockets or similar technology, so that new incoming messages can show up in real time.

<h1 id="description">Project Description</h1>

The project has the backend built with Django and the Django REST framework while the frontend uses React

## Technologies

### **Backend**

- Python
- Django
  - Django REST framework
  - Django Channels (For WebSockets)

### **Frontend**

- React

  - React-use-Websockets
  - React-router-dom
  - React MDB bootstrap

- Axios
- HTML
- CSS
- Bootstrap

**<h2 id="desc">Description</h2>**

- The messaging app used django for the backend and react for the frontend part.

- The backend incorporates the Django REST framework to build an API where the customer messages can be sent and received.

- Django Channels package is also used on the backend to leverage on websocket technology and implement a real-time chat service.

- The messages are stored in a MySQL database.

- The frontend part uses the React framework. React-bootstrap and mdb-react bootstrap are used to speed up the development process from using their ready-made, customizable ui components.

- React-use-websockets is used for implementing websockets in the frontend part.

**<h2 id="features">Implemented Features</h2>**

### Basic features

- The system allows a team of agents to log in at the same time and respond to incoming messages from (potentially many) customers in a streamlined fashion

- The customer messages can be sent and received through an API endpoint which can be simulated via a simple web form or a postman collection

- Agent and customer service messages are stored in a MySQL database and appear on the agents portal

- The application provides a way to view and respond to the individual messages

### Extended features

- The app uses topics, filters and colors to help agents divide work amongst themselves and to prevent
  multiple agents working on the same message at once.

  - The topics are chosen by the customer before sending a message which helps in classifying the messages in the agent UI.

  - Colors are used to distinguish between the messages which have an agent responding to them and those without

  - Filters are used to filter among possible topics and also filter the messages with agents.

- More urgent messages in need of immediate attention can be surfaced by the use of filters.

  - The app also sorts the messages from the latest to the oldest.

- The agent UI is more interactive by polling the database every 5 seconds.
  - This also helps in providing some time for the agents to choose from already received messages before new ones appear.

The customer-facing UI is more interactive by leveraging websockets technology, such that new incoming messages in the customer-agent chat show up in real time.

### Scaling

<p>With the current setup of the backend and frontend, the app can be easily scaled as the customer base grows. Some include: </p>

- Implement websockets instead of polling from the database

- Add sorting feature and more filter parameters in the agent UI.

- The django server can be spread across multiple servers and a load balancer used to distribute traffic across the servers.

- Database can be distributed increasing capacity to handle requests.

<h2 id="installation">Installation</h2>

### Dependencies

- **[Python v3.11](https://www.makeuseof.com/install-python-ubuntu/#use-deadsnakes-ppa-to-install-python-3-12-on-ubuntu)**

- **[Node and npm](https://github.com/nodesource/distributions#nodejs)**

- **[MySQL](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-22-04)**

## **Setup**

In the project root directory, from the command line interface:

### **Frontend**

```
cd frontend

#install dependencies
npm install

#start development server
npm run dev
```

### **Database**

Create a user named `branch` with the password `branchPassword`

Create a database named `branch`

Grant the user `branch` access to the `branch` database.

### **Backend**

```
sudo apt install -y build-essential libssl-dev libffi-dev python3-dev

# Package mananager and Virtual environment
sudo apt install -y python3-pip python3-venv

cd backend

# Create virtual environment
python3 -m venv chat_env

# Activate virtual env
source chat_env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Dev server
python manage.py runserver
```

You can now view and interact with the website at [localhost:5173](localhost:5173).

**From the menu on the right:**

**Login**

- Login as a user
- Choose a topic and write a message
- Send message
- Into chat page

**Agent**

- Login as an agent
- Support page.
  - Lists messages starting with the most recent
  - Filters; right menu.
  - Respond.
  - Chat page.
    - Send messages
    - End conversation