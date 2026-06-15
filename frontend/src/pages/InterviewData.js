export const INTERVIEW_QUESTION_BANK = {
  "Frontend Developer": {
    mcqs: [
      {
        question: "Which hook is used to perform side effects in React function components?",
        options: ["A) useState", "B) useEffect", "C) useContext", "D) useReducer"],
        correct: "B"
      },
      {
        question: "What is the correct way to prevent a default action of an event in JavaScript?",
        options: ["A) event.stopPropagation()", "B) event.preventDefault()", "C) return false", "D) event.cancelBubble = true"],
        correct: "B"
      },
      {
        question: "Which of the following is true about React state?",
        options: ["A) State is immutable outside the component", "B) State is mutable directly using state = newVal", "C) State updates can be synchronous or asynchronous", "D) State changes do not trigger re-renders"],
        correct: "C"
      },
      {
        question: "In CSS Flexbox, what is the default value of the flex-direction property?",
        options: ["A) column", "B) row", "C) row-reverse", "D) column-reverse"],
        correct: "B"
      },
      {
        question: "Which HTML5 tag is used to specify a footer for a document or section?",
        options: ["A) <bottom>", "B) <section>", "C) <footer>", "D) <aside>"],
        correct: "C"
      },
      {
        question: "What is the main benefit of virtual DOM in React?",
        options: ["A) It loads pages faster from the server", "B) It directly updates the browser HTML layout tree", "C) It minimizes expensive direct DOM manipulations through diffing", "D) It makes the browser memory footprint smaller"],
        correct: "C"
      },
      {
        question: "Which CSS Grid property is used to define the gap size between grid items?",
        options: ["A) grid-spacing", "B) grid-margin", "C) gap", "D) grid-padding"],
        correct: "C"
      },
      {
        question: "How do you pass a value from a parent component to a child component in React?",
        options: ["A) Using states", "B) Using props", "C) Using local variables", "D) Using context selectors"],
        correct: "B"
      },
      {
        question: "Which of the following is NOT a valid value for the position property in CSS?",
        options: ["A) static", "B) relative", "C) inline", "D) sticky"],
        correct: "C"
      },
      {
        question: "What does semantic HTML mean?",
        options: ["A) Using tags that convey meaning about the content they contain", "B) Writing HTML tags in alphabetical order", "C) Styling HTML elements without CSS", "D) Using div tags for everything to keep it clean"],
        correct: "A"
      },
      {
        question: "What is the output of 'typeof NaN' in JavaScript?",
        options: ["A) 'NaN'", "B) 'undefined'", "C) 'number'", "D) 'object'"],
        correct: "C"
      },
      {
        question: "Which hook should you use to store a mutable value that does not cause a re-render when changed?",
        options: ["A) useState", "B) useRef", "C) useMemo", "D) useCallback"],
        correct: "B"
      },
      {
        question: "What is the purpose of the 'key' prop in React lists?",
        options: ["A) To apply custom CSS styles to each list item", "B) To identify which items have changed, been added, or been removed", "C) To access the element index globally", "D) To encrypt data stored in components"],
        correct: "B"
      },
      {
        question: "Which JavaScript array method returns a new array with all elements that pass a test?",
        options: ["A) map()", "B) forEach()", "C) filter()", "D) reduce()"],
        correct: "C"
      },
      {
        question: "What does CSS stand for?",
        options: ["A) Computer Style Sheets", "B) Creative Style Sheets", "C) Cascading Style Sheets", "D) Colorful Style Sheets"],
        correct: "C"
      },
      {
        question: "What is the default display value of a <div> element?",
        options: ["A) inline", "B) inline-block", "C) block", "D) flex"],
        correct: "C"
      },
      {
        question: "Which of the following resolves variables at compile time rather than run time in JavaScript?",
        options: ["A) Lexical scoping", "B) Closures", "C) Dynamic binding", "D) Prototype inheritance"],
        correct: "A"
      },
      {
        question: "Which browser API allows you to store key-value pairs that persist even after the browser is closed?",
        options: ["A) SessionStorage", "B) Cookies", "C) LocalStorage", "D) IndexedDB"],
        correct: "C"
      },
      {
        question: "How do you check if an element has a specific class in vanilla JavaScript?",
        options: ["A) element.classes.has('name')", "B) element.classList.contains('name')", "C) element.hasClass('name')", "D) element.className == 'name'"],
        correct: "B"
      },
      {
        question: "Which React hook is used to memoize values to optimize rendering performance?",
        options: ["A) useCallback", "B) useMemo", "C) useRef", "D) useEffect"],
        correct: "B"
      },
      {
        question: "What is the correct syntax for importing a default export from another file in ES6?",
        options: ["A) import { name } from './file'", "B) import name from './file'", "C) const name = require('./file')", "D) import * as name from './file'"],
        correct: "B"
      },
      {
        question: "Which of the following properties controls the stacking order of elements in CSS?",
        options: ["A) stack-index", "B) order", "C) z-index", "D) layer"],
        correct: "C"
      },
      {
        question: "What is a closure in JavaScript?",
        options: ["A) A function combined with its lexical environment", "B) The end of a loop statement", "C) A tag closing statement in HTML", "D) A method that clears browser cookies"],
        correct: "A"
      },
      {
        question: "Which of the following is a CSS preprocessor?",
        options: ["A) React", "B) Webpack", "C) Sass", "D) Node"],
        correct: "C"
      },
      {
        question: "What is the purpose of media queries in CSS?",
        options: ["A) To query SQL databases directly from style sheets", "B) To apply different styles depending on device screen sizes", "C) To play video and audio files in HTML", "D) To request analytics information from servers"],
        correct: "B"
      }
    ],
    theory: [
      "Explain the differences between state and props in React.",
      "What is the event loop in JavaScript and how does asynchronous execution work?",
      "How does the virtual DOM work in React, and what is the reconciliation process?",
      "Describe CSS Flexbox vs Grid and when you would use each.",
      "What is Redux and what problems does it solve in application state management?"
    ]
  },
  "Backend Developer": {
    mcqs: [
      {
        question: "What is Node.js?",
        options: ["A) A programming language", "B) A JavaScript runtime environment built on Chrome's V8 engine", "C) A frontend styling framework", "D) A SQL database builder"],
        correct: "B"
      },
      {
        question: "Which HTTP status code represents 'Internal Server Error'?",
        options: ["A) 400", "B) 404", "C) 500", "D) 401"],
        correct: "C"
      },
      {
        question: "In Express.js, what does the next() function do?",
        options: ["A) Resolves the current promise", "B) Passes execution control to the next middleware function", "C) Sends the response back to the client", "D) Ends the server process"],
        correct: "B"
      },
      {
        question: "Which database type stores data in documents rather than tabular schemas?",
        options: ["A) PostgreSQL", "B) NoSQL", "C) MySQL", "D) Oracle"],
        correct: "B"
      },
      {
        question: "What is the purpose of JWT (JSON Web Token)?",
        options: ["A) To store database schemas", "B) Securely transmitting information between parties as a JSON object", "C) To compile JavaScript to binary code", "D) To encrypt static HTML files"],
        correct: "B"
      },
      {
        question: "In Node.js, how do you import a built-in module like 'fs' using CommonJS?",
        options: ["A) import fs from 'fs'", "B) const fs = require('fs')", "C) const fs = include('fs')", "D) #include <fs.h>"],
        correct: "B"
      },
      {
        question: "Which HTTP method is typically used to update an existing resource completely?",
        options: ["A) GET", "B) POST", "C) PUT", "D) DELETE"],
        correct: "C"
      },
      {
        question: "Which NoSQL database is most commonly paired in the MERN stack?",
        options: ["A) Redis", "B) MongoDB", "C) Cassandra", "D) Neo4j"],
        correct: "B"
      },
      {
        question: "What is a primary key in a SQL database?",
        options: ["A) A key that encrypts user passwords", "B) A unique identifier for a database record", "C) The username of the database administrator", "D) A command that deletes tables"],
        correct: "B"
      },
      {
        question: "What is rate limiting used for in web APIs?",
        options: ["A) To limit database query response sizes", "B) To control the rate of traffic sent or received by a server", "C) To compile backend code faster", "D) To increase the network bandwidth limit"],
        correct: "B"
      },
      {
        question: "Which NPM package is commonly used to hash passwords securely in Node.js?",
        options: ["A) bcrypt", "B) crypto-js", "C) jsonwebtoken", "D) cors"],
        correct: "A"
      },
      {
        question: "What is the main purpose of the CORS middleware in Node.js?",
        options: ["A) To parse incoming JSON bodies", "B) To enable Cross-Origin Resource Sharing for restricted domains", "C) To log API requests", "D) To compress HTTP response headers"],
        correct: "B"
      },
      {
        question: "Which SQL clause is used to filter records based on a specified pattern?",
        options: ["A) WHERE", "B) HAVING", "C) LIKE", "D) GROUP BY"],
        correct: "C"
      },
      {
        question: "In MongoDB, what is the role of an ObjectId?",
        options: ["A) To encrypt database connections", "B) A unique 12-byte identifier for documents", "C) To specify document index rules", "D) To define document field types"],
        correct: "B"
      },
      {
        question: "Which HTTP method is considered 'idempotent'?",
        options: ["A) POST", "B) PATCH", "C) GET", "D) NONE of the above"],
        correct: "C"
      },
      {
        question: "What is the purpose of database indexing?",
        options: ["A) To encrypt column values", "B) To speed up data retrieval operations", "C) To count the number of database records", "D) To organize files into columns"],
        correct: "B"
      },
      {
        question: "Which Express.js method is used to define middleware that executes for all incoming requests?",
        options: ["A) app.get()", "B) app.use()", "C) app.post()", "D) app.set()"],
        correct: "B"
      },
      {
        question: "In Node.js, what does the Event Loop run on?",
        options: ["A) Multiple worker threads", "B) A single thread", "C) The database server process", "D) The client browser"],
        correct: "B"
      },
      {
        question: "Which SQL join returns all records when there is a match in either left or right table?",
        options: ["A) INNER JOIN", "B) LEFT JOIN", "C) RIGHT JOIN", "D) FULL OUTER JOIN"],
        correct: "D"
      },
      {
        question: "What is the role of Mongoose in the MERN stack?",
        options: ["A) It builds frontend React components", "B) An Object Data Modeling (ODM) library for MongoDB and Node.js", "C) A web server host", "D) An API testing tool"],
        correct: "B"
      },
      {
        question: "Which NPM package parses multi-part/form-data for file uploads in Node.js?",
        options: ["A) multer", "B) body-parser", "C) express-upload", "D) fs-uploader"],
        correct: "A"
      },
      {
        question: "What does the HTTP code '403 Forbidden' indicate?",
        options: ["A) The requested file does not exist", "B) The client is unauthorized to access the content", "C) The server is offline", "D) The request payload is too large"],
        correct: "B"
      },
      {
        question: "Which module is used in Node.js to resolve file and folder paths?",
        options: ["A) fs", "B) path", "C) url", "D) os"],
        correct: "B"
      },
      {
        question: "Which SQL aggregate function is used to count the number of rows?",
        options: ["A) SUM()", "B) COUNT()", "C) AVG()", "D) TOTAL()"],
        correct: "B"
      },
      {
        question: "What is the purpose of environment variables (.env files)?",
        options: ["A) To style the website color schemes", "B) To store sensitive configuration credentials securely away from code repos", "C) To increase compilation speed", "D) To declare database queries"],
        correct: "B"
      }
    ],
    theory: [
      "Explain how Node.js handles concurrency despite being single-threaded.",
      "What are RESTful APIs and what are the best practices for designing them?",
      "Explain the difference between SQL and NoSQL databases, and when you'd use MongoDB over PostgreSQL.",
      "What is middleware in Express.js and how does it modify requests/responses?",
      "How do you secure a backend API (authentication, rate limiting, encryption)?"
    ]
  },
  "Full Stack": {
    mcqs: [
      {
        question: "What does MERN stand for?",
        options: ["A) MySQL, Express, React, Node", "B) MongoDB, Express, React, Node", "C) MongoDB, Ember, React, Node", "D) MySQL, Express, Redux, Node"],
        correct: "B"
      },
      {
        question: "What is Client-Side Rendering (CSR)?",
        options: ["A) Building HTML layout entirely on server", "B) Rendering pages directly in browser using JavaScript", "C) Pre-compiling static pages at build time", "D) Hosting websites on client local machines"],
        correct: "B"
      },
      {
        question: "Which mechanism allows React frontend to communicate with Express backend on a different port during local development?",
        options: ["A) CORS and Webpack Proxies", "B) LocalStorage links", "C) Context APIs", "D) Redux Slices"],
        correct: "A"
      },
      {
        question: "What is the difference between Server-Side Rendering (SSR) and CSR?",
        options: ["A) SSR sends pre-rendered HTML to browser; CSR sends blank HTML and renders it via JS", "B) SSR is always faster than CSR", "C) CSR does not support React components", "D) SSR is hosted on SQL servers only"],
        correct: "A"
      },
      {
        question: "Which protocol allows persistent bi-directional communication between client and server?",
        options: ["A) HTTP/1.1", "B) HTTPS", "C) WebSockets", "D) REST"],
        correct: "C"
      },
      {
        question: "What is the primary role of a router in a React application?",
        options: ["A) To link database tables", "B) To navigate between pages without refreshing the browser", "C) To host the server endpoints", "D) To handle user session keys"],
        correct: "B"
      },
      {
        question: "Which command starts the frontend dev server in standard React projects?",
        options: ["A) node start", "B) npm run build", "C) npm start", "D) nodemon start"],
        correct: "C"
      },
      {
        question: "Which of the following describes a full-stack developer?",
        options: ["A) Working only on visual CSS designs", "B) Managing database structures only", "C) Working on both front-end interface and back-end logic layers", "D) Managing server network cards only"],
        correct: "C"
      },
      {
        question: "Which component represents the entry point for API calls in the MERN architecture?",
        options: ["A) index.html", "B) Express Server Route", "C) React ComponentState", "D) Mongoose Schema model"],
        correct: "B"
      },
      {
        question: "What is the purpose of Webpack?",
        options: ["A) To host database servers", "B) A module bundler that bundles JavaScript, CSS, and assets into static files", "C) An API testing application", "D) An authentication middleware"],
        correct: "B"
      },
      {
        question: "Which status code means a request has succeeded and a new resource was created?",
        options: ["A) 200 OK", "B) 201 Created", "C) 304 Not Modified", "D) 400 Bad Request"],
        correct: "B"
      },
      {
        question: "What is a major advantage of utilizing GraphQL over REST APIs?",
        options: ["A) It secures password columns automatically", "B) Clients can query specific fields and fetch multiple resources in a single request", "C) It loads images faster", "D) It does not require a database connection"],
        correct: "B"
      },
      {
        question: "What does the MVC pattern stand for?",
        options: ["A) Model View Control", "B) Module Variable Code", "C) Mode Variable Component", "D) Main Vector Component"],
        correct: "A"
      },
      {
        question: "Where do you typically store the user session token in a MERN stack application for persistence?",
        options: ["A) Inside component local state", "B) Browser LocalStorage or Secure Cookies", "C) In the database schema variables", "D) In the server environment file"],
        correct: "B"
      },
      {
        question: "What does the abbreviation JSON stand for?",
        options: ["A) JavaScript Object Notation", "B) Java Oriented Network", "C) Joint Syntax Object Names", "D) JavaScript Organized Node"],
        correct: "A"
      },
      {
        question: "What is the function of the package.json file?",
        options: ["A) Storing custom CSS files", "B) Managing project metadata, scripts, and dependency library versions", "C) Defining database index tables", "D) Storing user password records"],
        correct: "B"
      },
      {
        question: "Which of the following is a CSS framework commonly utilized by developers?",
        options: ["A) Express", "B) Mongoose", "C) TailwindCSS", "D) Redux"],
        correct: "C"
      },
      {
        question: "What is the purpose of Docker?",
        options: ["A) To compile javascript files faster", "B) Pack and run applications in isolated, lightweight environments called containers", "C) To host Mongo collections online", "D) To build CSS layouts"],
        correct: "B"
      },
      {
        question: "What does Serverless computing mean?",
        options: ["A) Building apps without using servers", "B) Running code on ephemeral servers managed entirely by cloud providers", "C) Storing databases on client local machines", "D) Developing apps offline"],
        correct: "B"
      },
      {
        question: "In web applications, what is validation?",
        options: ["A) Compiling files cleanly", "B) Ensuring user inputs match expected formats, constraints, and security criteria", "C) Encrypting database files", "D) Creating HTML templates"],
        correct: "B"
      },
      {
        question: "Which JavaScript function fetches resources asynchronously across network hosts?",
        options: ["A) axios.get() / fetch()", "B) JSON.stringify()", "C) require()", "D) element.innerHTML"],
        correct: "A"
      },
      {
        question: "Which of the following is a relational database management system?",
        options: ["A) MongoDB", "B) Redis", "C) PostgreSQL", "D) DynamoDB"],
        correct: "C"
      },
      {
        question: "Which design principle asserts that a class or module should have one, and only one, reason to change?",
        options: ["A) Open/Closed Principle", "B) Liskov Substitution", "C) Single Responsibility Principle", "D) Dependency Inversion"],
        correct: "C"
      },
      {
        question: "What is the purpose of version control software like Git?",
        options: ["A) To style visual elements", "B) Tracking modifications in source code and coordinating code changes among developers", "C) To compile backend binaries", "D) To backup database tables"],
        correct: "B"
      },
      {
        question: "What is the final phase of full-stack developer cycles before launch?",
        options: ["A) Requirements analysis", "B) Testing and quality validation", "C) Writing CSS stylesheets", "D) Creating database models"],
        correct: "B"
      }
    ],
    theory: [
      "What is CORS (Cross-Origin Resource Sharing) and how do you resolve it in a Node/React app?",
      "Describe the full lifecycle of an HTTP request from browser entry to database response.",
      "What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?",
      "Explain how indexes work in databases and how they optimize query speeds.",
      "How do you manage sessions and authentication across a decoupled React client and Node server?"
    ]
  },
  "Data Scientist": {
    mcqs: [
      {
        question: "What is Python in Data Science?",
        options: ["A) A database query compiler", "B) A highly expressive programming language with rich analytical libraries", "C) A visual plotting framework", "D) An operating system platform"],
        correct: "B"
      },
      {
        question: "What is overfitting in machine learning?",
        options: ["A) When a model fails to learn patterns from training data", "B) When a model performs exceptionally well on training data but poorly on unseen test data", "C) When a model compiles too slowly", "D) When data splits contain duplicates"],
        correct: "B"
      },
      {
        question: "Which Python library is primarily utilized for manipulating multi-dimensional arrays?",
        options: ["A) Pandas", "B) NumPy", "C) Scikit-Learn", "D) Matplotlib"],
        correct: "B"
      },
      {
        question: "What is supervised learning?",
        options: ["A) Training models on datasets containing labeled input-output pairs", "B) Training models on completely unlabeled data", "C) Analyzing data manually under supervisor guidelines", "D) Training models on databases with missing values"],
        correct: "A"
      },
      {
        question: "Which algorithm is commonly used for classification problems in Machine Learning?",
        options: ["A) Linear Regression", "B) Logistic Regression", "C) K-Means Clustering", "D) Principal Component Analysis"],
        correct: "B"
      },
      {
        question: "What is the purpose of Pandas library?",
        options: ["A) Mathematical calculations on complex numbers", "B) High-performance data manipulation and analysis using DataFrames", "C) Training neural network layers", "D) Creating charts and scatter plots"],
        correct: "B"
      },
      {
        question: "Which metric is most suitable for evaluating balanced classification performance?",
        options: ["A) Mean Squared Error (MSE)", "B) R-squared", "C) Accuracy", "D) F1-Score"],
        correct: "D"
      },
      {
        question: "What does 'unsupervised learning' mean?",
        options: ["A) Training models without labeled responses to identify underlying patterns", "B) Training models using remote supervision", "C) Training ML algorithms on SQL tables", "D) Manually running statistics scripts"],
        correct: "A"
      },
      {
        question: "Which statistical concept describes the spread or dispersion of data points around their mean?",
        options: ["A) Median", "B) Mode", "C) Standard Deviation", "D) Correlation Coefficient"],
        correct: "C"
      },
      {
        question: "What is the main objective of Principal Component Analysis (PCA)?",
        options: ["A) To train deep classification layers", "B) Dimensionality reduction to simplify complex datasets while preserving variance", "C) To impute missing database fields", "D) To plot regression lines"],
        correct: "B"
      },
      {
        question: "Which of the following describes K-Means?",
        options: ["A) A supervised classification algorithm", "B) An unsupervised clustering algorithm that partitions data into K groups", "C) A statistical regression method", "D) A data cleaning library"],
        correct: "B"
      },
      {
        question: "What is a Confusion Matrix used for?",
        options: ["A) Visualizing high-dimensional feature distributions", "B) Summarizing classification model performance metrics (TP, FP, TN, FN)", "C) Generating random splits", "D) Debugging memory warning logs"],
        correct: "B"
      },
      {
        question: "Which deep learning library is developed and managed by Google?",
        options: ["A) PyTorch", "B) TensorFlow", "C) Scikit-Learn", "D) NumPy"],
        correct: "B"
      },
      {
        question: "What is the purpose of cross-validation?",
        options: ["A) Splitting databases into tables", "B) Evaluating model generalization ability by partitioning data into multiple folds", "C) Standardizing feature scales", "D) Combining multiple model architectures"],
        correct: "B"
      },
      {
        question: "Which metric describes the proportion of actual positives that were correctly identified?",
        options: ["A) Precision", "B) Recall / Sensitivity", "C) Specificity", "D) Accuracy"],
        correct: "B"
      },
      {
        question: "In statistics, what is the 'p-value' used for?",
        options: ["A) To measure feature standard deviations", "B) Assessing statistical significance to reject/accept a null hypothesis", "C) To calculate average values", "D) To represent linear slopes"],
        correct: "B"
      },
      {
        question: "What is data imputation?",
        options: ["A) Deleting complete data columns", "B) Replacing missing or null data fields with estimated/calculated values", "C) Exporting data to SQL sheets", "D) Training decision trees"],
        correct: "B"
      },
      {
        question: "Which plot is most suitable to visualize relationships between two continuous variables?",
        options: ["A) Bar Chart", "B) Histogram", "C) Scatter Plot", "D) Pie Chart"],
        correct: "C"
      },
      {
        question: "What is the purpose of standardizing features before training distance-based algorithms?",
        options: ["A) To reduce the file storage size", "B) Ensuring features have equal scale so larger values do not dominate calculations", "C) To speed up compilation", "D) To convert text values to numeric IDs"],
        correct: "B"
      },
      {
        question: "Which algorithm is based on building a large collection of decision trees and averaging their predictions?",
        options: ["A) Linear Support Vector Machine", "B) Random Forest", "C) Logistic Regression", "D) Naive Bayes Classifier"],
        correct: "B"
      },
      {
        question: "What does the term 'bias-variance trade-off' represent?",
        options: ["A) Balances model underfitting (high bias) vs overfitting (high variance)", "B) Balancing model execution speed vs accuracy", "C) Selecting feature sizes", "D) Database split ratios"],
        correct: "A"
      },
      {
        question: "Which data structure is the primary analytical component in Pandas?",
        options: ["A) List", "B) Dictionary", "C) DataFrame", "D) Tuple"],
        correct: "C"
      },
      {
        question: "What is a baseline model?",
        options: ["A) The final optimized ML model deployed to production", "B) A simple model (e.g. mean prediction) to compare future model performances", "C) A model built with zero training features", "D) A database connector schema"],
        correct: "B"
      },
      {
        question: "Which activation function is commonly used in output layers for binary classification neural networks?",
        options: ["A) ReLU", "B) Sigmoid", "C) Softmax", "D) Tanh"],
        correct: "B"
      },
      {
        question: "What is the main objective of feature engineering?",
        options: ["A) Deleting redundant database columns", "B) Creating new representative features from raw data to improve ML model accuracy", "C) Coding custom ML algorithms", "D) Plotting statistical metrics"],
        correct: "B"
      }
    ],
    theory: [
      "What is overfitting in machine learning and how do you prevent it?",
      "Explain the difference between supervised and unsupervised learning with examples.",
      "How do validation sets and cross-validation help in evaluating machine learning models?",
      "What is a confusion matrix and what are precision, recall, and F1-score?",
      "Explain how linear regression works and how gradient descent finds optimal coefficients."
    ]
  },
  "DevOps": {
    mcqs: [
      {
        question: "What is DevOps?",
        options: ["A) A coding language", "B) A cultural and professional movement combining software development and IT operations", "C) A server cloud host", "D) A system database builder"],
        correct: "B"
      },
      {
        question: "What is containerization?",
        options: ["A) Storing files inside folders", "B) Lightweight virtualization packaging an application and its dependencies together", "C) Saving database records into documents", "D) Compiling source code to binaries"],
        correct: "B"
      },
      {
        question: "Which Docker command lists all currently running containers?",
        options: ["A) docker images", "B) docker ps", "C) docker run", "D) docker logs"],
        correct: "B"
      },
      {
        question: "What does CI/CD stand for?",
        options: ["A) Continuous Integration and Continuous Deployment", "B) Code Integration and Code Development", "C) Computer Integration and Computer Deployment", "D) Control Infrastructure and Control Development"],
        correct: "A"
      },
      {
        question: "What is Kubernetes?",
        options: ["A) A container registry website", "B) An open-source platform for automating deployment, scaling, and management of containerized apps", "C) A lightweight VM runtime", "D) A backend framework"],
        correct: "B"
      },
      {
        question: "What is Infrastructure as Code (IaC)?",
        options: ["A) Writing code on remote servers", "B) Managing and provisioning computer data centers through machine-readable definition files", "C) Documenting deployment steps", "D) Creating HTML templates"],
        correct: "B"
      },
      {
        question: "Which of the following is a CI/CD tool?",
        options: ["A) React", "B) MongoDB", "C) Jenkins", "D) Redux"],
        correct: "C"
      },
      {
        question: "In Kubernetes, what is a Pod?",
        options: ["A) A system monitoring tool", "B) The smallest deployable unit containing one or more containers sharing storage/network", "C) A virtual machine instance", "D) A container registry directory"],
        correct: "B"
      },
      {
        question: "What is the default port for the HTTP protocol?",
        options: ["A) 443", "B) 80", "C) 8080", "D) 22"],
        correct: "B"
      },
      {
        question: "What is Ansible used for?",
        options: ["A) Storing database backups", "B) Open-source configuration management, application deployment, and task automation", "C) Building UI dashboards", "D) Running unit tests"],
        correct: "B"
      },
      {
        question: "Which protocol is utilized to securely log in to remote servers over unsecure networks?",
        options: ["A) FTP", "B) HTTP", "C) SSH", "D) SMTP"],
        correct: "C"
      },
      {
        question: "What is the purpose of Docker Hub?",
        options: ["A) To compile source code", "B) A cloud-based registry service to find and share container images", "C) An API testing host", "D) A cloud database provider"],
        correct: "B"
      },
      {
        question: "Which of the following is a cloud computing provider?",
        options: ["A) Docker", "B) Kubernetes", "C) AWS (Amazon Web Services)", "D) GitHub"],
        correct: "C"
      },
      {
        question: "What does the abbreviation Git describe?",
        options: ["A) A local document editor", "B) A distributed version control system for tracking changes in source code", "C) A cloud hosting platform", "D) A command interpreter"],
        correct: "B"
      },
      {
        question: "In monitoring systems, what is Prometheus?",
        options: ["A) A container orchestration system", "B) An open-source monitoring and alerting toolkit", "C) A CI pipeline runner", "D) A server config file manager"],
        correct: "B"
      },
      {
        question: "What is a reverse proxy server commonly used for?",
        options: ["A) Creating SQL query tables", "B) Load balancing, security filtering, and caching incoming server requests", "C) Compiling React code", "D) Storing user login details"],
        correct: "B"
      },
      {
        question: "Which file is utilized to declare container build instructions in Docker?",
        options: ["A) package.json", "B) Dockerfile", "C) docker-compose.yml", "D) server.js"],
        correct: "B"
      },
      {
        question: "In DevOps, what is 'shift-left' testing?",
        options: ["A) Moving testing phases to late deployment stages", "B) Integrating testing earlier in the software development lifecycle", "C) Deleting unit test codes", "D) Running tests on client local systems"],
        correct: "B"
      },
      {
        question: "What does the SSH port 22 control access to?",
        options: ["A) Web server responses", "B) Secure Shell remote server terminal control", "C) SQL database query streams", "D) Email transmissions"],
        correct: "B"
      },
      {
        question: "What is the role of Git Git Hooks?",
        options: ["A) Storing custom styles", "B) Executing custom scripts when specific actions occur in the Git lifecycle (e.g. pre-commit)", "C) Deploying containers to AWS", "D) Formatting markdown documents"],
        correct: "B"
      },
      {
        question: "Which DevOps tool is most suitable for provisioning virtual infrastructure resources using declarative files?",
        options: ["A) Jenkins", "B) Terraform", "C) Docker", "D) Git"],
        correct: "B"
      },
      {
        question: "What does the HTTP code '401 Unauthorized' represent?",
        options: ["A) The requested address does not exist", "B) The client request lacks valid authentication credentials", "C) The server connection timed out", "D) The request parameters are malformed"],
        correct: "B"
      },
      {
        question: "In Kubernetes, what is Helm?",
        options: ["A) A container network plugin", "B) A package manager that automates the creation, packaging, and deployment of Kubernetes resources", "C) A service load balancer", "D) An alerting dashboard"],
        correct: "B"
      },
      {
        question: "Which command in Linux changes file access permissions?",
        options: ["A) chown", "B) chmod", "C) chgrp", "D) ls -la"],
        correct: "B"
      },
      {
        question: "What is a roll-back operation?",
        options: ["A) Deleting code changes from repository commits", "B) Reverting a system deployment back to its previous working stable state", "C) Rebooting database servers", "D) Renaming system files"],
        correct: "B"
      }
    ],
    theory: [
      "What is Docker and how does containerization differ from traditional virtual machines?",
      "Explain Continuous Integration (CI) and Continuous Deployment (CD) and list some key pipeline steps.",
      "What is Infrastructure as Code (IaC) and what are its benefits?",
      "How does Kubernetes manage containers, and what is a Pod?",
      "Describe how you would set up centralized logging and monitoring for a production microservices application."
    ]
  }
};
