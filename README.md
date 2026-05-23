# StreetSync
StreetSync is a real-time, location-based ecosystem built on the MERN stack. It bridges the gap between digital consumers and mobile street vendors by establishing low-latency telemetry pipelines and dynamic order management. By integrating live geolocation streaming with traditional web storefronts, StreetSync provides street vendors with the digital infrastructure needed to compete in a modern marketplace.

# Key Features
## Authentication & Access
### ControlDual-Role Engine
Dedicated workflows and permissions for Customers and Street Vendors.
### JWT Identity Gate
Session persistence and secure authorization handled via secure HTTP-Only cookies/Bearer tokens.
### Input Validation
Strict client and server-side verification using robust validation schemas (Joi).
  
## Geospatial Telemetry
### Real-Time GPS Tracking
Live vendor tracking powered by bidirectional event-driven Socket.io web sockets.
### Proximity Computations
Rapid local search utilizing MongoDB's advanced 2dsphere index to perform spatial queries within target radiuses.
### Interactive Mapping
Highly responsive mapping views utilizing modern canvas markers (Leaflet.js).
  
## Operations & Transactions
### Digital Storefront (CRUD)
Complete management tools for vendor inventories utilizing embedded document structures.
### Order State Machine
End-to-end transaction flows tracking order progression through distinct lifecycles (Pending -> Preparing -> Ready -> Completed).
### Instant Dashboards
Reactive vendor panels for incoming order queues and toggleable live status alerts.

# Tech Stack
| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI/UX** | React.js, Tailwind CSS, Leaflet.js |
| **Application Layer** | Node.js, Express.js |
| **Real-time Pipeline** | Socket.io (WebSockets) |
| **Database Tier** | MongoDB, Mongoose ORM |
| **Security & Validation** | JSON Web Tokens (JWT), Bcrypt, Joi |

# Quick Start Guide
## Prerequisites
Ensure you have the following installed locally:
  ### Node.js (v18.x or higher)
  ### MongoDB (Local instance or Atlas connection string)
  Repository Setup
              
      Bash
  
      # Clone the repository
      git clone https://github.com/your-username/StreetSync.git
      cd StreetSync

## Backend Configuration
### Navigate to the server folder: cd server
### Create a .env file in the root of the server directory:

    Code snippet
    
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/streetsync
    JWT_SECRET=your_super_secure_jwt_secret_key
    CORS_ORIGIN=http://localhost:3000

### Install dependencies and start the backend:
    Bash
    npm install
    npm run dev

## Frontend Configuration
### Open a new terminal window and navigate to the client folder: cd client
### Create a .env file in the root of the client directory:

    Code snippet
    
    REACT_APP_API_URL=http://localhost:5000
    REACT_APP_SOCKET_URL=http://localhost:5000

### Install dependencies and spin up the development environment:
    Bash
    
    npm install
    npm start

# Core Architecture & Process Flow
StreetSync relies heavily on an event-driven loop to pass location updates between endpoints without relying on continuous HTTP polling:

    [Vendor Device] --(Sends GPS Coordinates via Socket.io)--> [Node.js Server]
                                                                  |
                                      +---------------------------+---------------------------+
                                      |                                                       |
                        (Asynchronously Updates MongoDB)                             (Broadcasts to Room)
                                      |                                                       |
                        [DS1: 2dsphere Location Index]                         [Customer Map Layer (Leaflet)]
For comprehensive structural breakdowns including Context Diagrams, Level 1 & 2 DFDs, and detailed Sequence charts, consult Chapter 3 (System Design) of the official project documentation.

# Testing Summary
The system is tested end-to-end to ensure structural security and high-availability operations:
## Unit Testing
Validation middleware handles malicious payloads or wrong coordinate points before hitting the data layers.
## Integration Testing
Verification of valid route execution and data parsing via Thunder Client payloads.
## System Testing
Multiclient WebSocket testing checking broadcast propagation delay and map marker layout updates.

# License
Distributed under the MIT License. See LICENSE for more information.
