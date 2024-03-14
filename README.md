# yugioh-tcg-cards-api

RESTful API for managing Yu-Gi-Oh cards. This project serves as a learning exercise to develop a robust backend API using Node.js, Express, and MongoDB. The API allows users to create, read, update, and delete archetypes(a group of cards who share a name component) or individual cards, providing a platform to practice CRUD operations, and data persistence. Also to explore various endpoints to interact with card data, to enhance my skills in building scalable APIs, and enjoy working with my favorite card game.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)

# Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Berns-C/yugioh-tcg-cards-api.git
   cd yugioh-tcg-cards-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `config.env` file in the root directory.
   - Add environment-specific variables:
     - `NODE_ENV` - Set environment (development or production)'
     - `PORT` - Set port for the project.
     - `API_MONGO_URI_ACCESS` - Set MongoDB URI.

## Features

### CRUD OPERATIONS

#### CARD ARCHETYPES

1. POST ARCHETYPES - `/archetypes/`

   Payload Details:

   ```
       "name": string, //Name of archetype (required)
       "source": {
           "domain": string, //domain URL of where the data originally from (required).
           "archetypeURL": string, //Full URL of where the archetype originally from (required).
           "cardUrlPathList": array // List of URL paths of cards belonging to this archetype. (Optional)
       },
       "coverImg": string
   ```

   Single Data Payload:

   ```
   {
       "name": "Unchained",
       "source": {
           "domain": "https://ygoprodeck.com",
           "archetypeUrl": "https://ygoprodeck.com/card-database/?&archetype=Unchained&num=100&offset=0",
           "cardUrlPathList": [
               "/card/unchained-soul-of-anguish-10405",
               "/card/unchained-soul-of-disaster-10403",
               "/card/unchained-soul-of-shyama-13803",
               "/card/abominable-chamber-of-the-unchained-10410",
               "/card/unchained-soul-of-rage-10404",
               "/card/wailing-of-the-unchained-souls-10408",
               "/card/unchained-twins-rakea-10402",
               "/card/escape-of-the-unchained-10409",
               "/card/unchained-soul-of-sharvara-13802",
               "/card/unchained-twins-sarama-10809",
               "/card/unchained-abomination-10406",
               "/card/abomination-s-prison-10407",
               "/card/unchained-twins-aruha-10401",
               "/card/unchained-soul-lord-of-yama-13804"
           ]
       },
       "coverImg": ""
   }
   ```

   Multiple Data Payload:

   ```
   [
   {
       "name": "Unchained",
       "source": {
           "domain": "https://ygoprodeck.com",
           "archetypeUrl": "https://ygoprodeck.com/card-database/?&archetype=Unchained&num=100&offset=0",
           "cardUrlPathList": [
               "/card/unchained-soul-of-anguish-10405",
               "/card/unchained-soul-of-disaster-10403",
               "/card/unchained-soul-of-shyama-13803",
               "/card/abominable-chamber-of-the-unchained-10410",
               "/card/unchained-soul-of-rage-10404",
               "/card/wailing-of-the-unchained-souls-10408",
               "/card/unchained-twins-rakea-10402",
               "/card/escape-of-the-unchained-10409",
               "/card/unchained-soul-of-sharvara-13802",
               "/card/unchained-twins-sarama-10809",
               "/card/unchained-abomination-10406",
               "/card/abomination-s-prison-10407",
               "/card/unchained-twins-aruha-10401",
               "/card/unchained-soul-lord-of-yama-13804"
           ]
       },
       "coverImg": ""
   },
   {
       "name": "Rikka",
       "coverImg": ""
       "source": {
           "domain": "https://ygoprodeck.com",
           "archetypeUrl": "https://ygoprodeck.com/card-database/?&archetype=Rikka&num=100&offset=0",
           "cardUrlPathList": [
               "/card/rikka-flurries-10966",
               "/card/rikka-konkon-13175",
               "/card/rikka-petal-10975",
               "/card/mudan-the-rikka-fairy-10972",
               "/card/rikka-glamour-10967",
               "/card/rikka-sheet-10964",
               "/card/hellebore-the-rikka-fairy-10969",
               "/card/cyclamen-the-rikka-fairy-10973",
               "/card/snowdrop-the-rikka-fairy-10970",
               "/card/rikka-tranquility-10965",
               "/card/primula-the-rikka-fairy-10974",
               "/card/erica-the-rikka-fairy-10971",
               "/card/kanzashi-the-rikka-queen-10968",
               "/card/rikka-queen-strenna-11080",
               "/card/rikka-princess-13176"
           ]
       },
   }
   ]
   ```

2. GET ARCHETYPE BY ID - `/archetypes/<insert archetype id>`
3. GET ARCHETYPE BY Name - `/archetypes/name/<insert archetype name>`
4. PUT ARCHETYPE BY ID - `/archetypes/<insert archetype id>`

   Payload Details:

   ```
       "name": string, //Name of archetype (required)
       "source": {
           "domain": string, //domain URL of where the data originally from (required).
           "archetypeURL": string, //Full URL of where the archetype originally from (required).
           "cardUrlPathList": array // List of URL paths of cards belonging to this archetype. (Optional)
       },
       "coverImg": string
   ```

   When performing an update, 1 or all fields can be present.

5. DELETE ARCHETYPE BY ID - `/archetypes/<insert archetype id>`

#### CARD ARCHETYPES

1. 1. POST CARDS - `/cards/`

   Payload Details:

   ```
       {
            "cardName": string, //Card name (required)
            "images": {
                "imgFileName": string, //Image link or image filename. (required)
                "imgCropFileName": string //Image link or image filename. (required)
            },
            "references": {
                "originalSources": {
                    "img": string, //Original image link. (Optional)
                    "imgCrop": string, //Original image link. (Optional)
                    "dataSource": string //Original link of the card. (Optional)
                },
                "tcgPlayer": string, //URL of the card in tcgPlayer for additional reference. (Optional)
                "cardMarket": string //URL of the card in cardMarket for additional reference. (Optional)
            },
            "dateReleased": {
                "tcgDate": string, // Date when was the card release in TCG. (Optional)
                "ocgDate": string // Date when was the card release in OCG. (Optional)
            },
            "type": string, //Indication of what type of card it is. (Ex. Spell Card, Trap Card or Monster Card, etc - Required)
            "typing": string, //Indication of what typing of card it is. (Ex. Quick Spell Card, Counter Trap Card or Cyberse Card, etc - Required)
            "archetype": string, //Attack points of a card. (Default null if no archetype provided. Cards can have no archatype.)
            "attribute": string, //Attribute(Ex. Fire, Wind, etc) of a card. (Optional since not all cards Attributes.)
            "levelOrRank": string, //Level or Rank of a card. (Optional since not all cards have Level or Rank.)
            "attack": string, //Attack points of a card. (Optional since not all cards have attack points.)
            pendulumText: string, //Pendulum card effect. (Optional since not all cards are Pendulumg card).
            "cardText": string //Card effect description (required)
        }
   ```

   Single Data Payload:

   ```
        {
            "cardName": "Live☆Twin Lil-la",
            "images": {
            "imgFileName": "73810864.jpg",
            "imgCropFileName": "73810864.jpg"
            },
            "references": {
            "originalSources": {
                "img": "https://images.ygoprodeck.com/images/cards/73810864.jpg",
                "imgCrop": "https://images.ygoprodeck.com/images/cards_cropped/73810864.jpg",
                "dataSource": "https://ygoprodeck.com/card/live-twin-lil-la-11454"
            },
            "tcgPlayer": "https://www.tcgplayer.com/search/yugioh/product?productLineName=yugioh&q=Live☆Twin%20Lil-la&view=grid",
            "cardMarket": "https://www.cardmarket.com/en/YuGiOh/Cards/Live☆Twin%20Lil-la"
            },
            "dateReleased": { "tcgDate": " 2020-12-03", "ocgDate": " 2020-09-12" },
            "type": "Effect Monster",
            "typing": "Cyberse",
            "archetype": "Live☆Twin",
            "attribute": "DARK",
            "levelOrRank": "2",
            "attack": "500",
            "cardText": "Your opponent must pay 500 LP to declare an attack. If this card is Normal or Special Summoned and you control no other monsters: You can Special Summon 1 \"Ki-sikil\" monster from your hand or Deck. You can only use this effect of \"Live☆Twin Lil-la\" once per turn."
        }

   ```

   Multiple Data Payload:

   ```
    [
        {
            "cardName": "Live☆Twin Lil-la",
            "images": {
            "imgFileName": "73810864.jpg",
            "imgCropFileName": "73810864.jpg"
            },
            "references": {
            "originalSources": {
                "img": "https://images.ygoprodeck.com/images/cards/73810864.jpg",
                "imgCrop": "https://images.ygoprodeck.com/images/cards_cropped/73810864.jpg",
                "dataSource": "https://ygoprodeck.com/card/live-twin-lil-la-11454"
            },
            "tcgPlayer": "https://www.tcgplayer.com/search/yugioh/product?productLineName=yugioh&q=Live☆Twin%20Lil-la&view=grid",
            "cardMarket": "https://www.cardmarket.com/en/YuGiOh/Cards/Live☆Twin%20Lil-la"
            },
            "dateReleased": { "tcgDate": " 2020-12-03", "ocgDate": " 2020-09-12" },
            "type": "Effect Monster",
            "typing": "Cyberse",
            "archetype": "Live☆Twin",
            "attribute": "DARK",
            "levelOrRank": "2",
            "attack": "500",
            "cardText": "Your opponent must pay 500 LP to declare an attack. If this card is Normal or Special Summoned and you control no other monsters: You can Special Summon 1 \"Ki-sikil\" monster from your hand or Deck. You can only use this effect of \"Live☆Twin Lil-la\" once per turn."
        },
        {
            "cardName": "Live☆Twin Sunny's Snitch",
            "images": {
            "imgFileName": "37582948.jpg",
            "imgCropFileName": "37582948.jpg"
            },
            "references": {
            "originalSources": {
                "img": "https://images.ygoprodeck.com/images/cards/37582948.jpg",
                "imgCrop": "https://images.ygoprodeck.com/images/cards_cropped/37582948.jpg",
                "dataSource": "https://ygoprodeck.com/card/live-twin-sunny-s-snitch-12183"
            },
            "tcgPlayer": "https://www.tcgplayer.com/search/yugioh/product?productLineName=yugioh&q=Live☆Twin%20Sunny's%20Snitch&view=grid",
            "cardMarket": "https://www.cardmarket.com/en/YuGiOh/Cards/Live☆Twin%20Sunny's%20Snitch"
            },
            "dateReleased": { "tcgDate": " 2021-08-12", "ocgDate": " 2021-04-17" },
            "type": "Spell Card",
            "typing": "Continuous",
            "archetype": "Live☆Twin",
            "cardText": "When this card is activated: You can add 1 \"Live☆Twin\" monster from your Deck to your hand. While you control an \"Evil★Twin\" monster, each time your opponent Normal or Special Summons a monster(s), you gain 200 LP, and if you do, inflict 200 damage to your opponent. You can only activate 1 \"Live☆Twin Sunny's Snitch\" per turn."
        }
    ]

   ```

2. GET CARD BY ID - `/cards/<insert card id>`
3. GET CARD BY Name - `/cards/name/<insert card name>`
4. PUT CARD BY ID - `/cards/<insert card id>`

   Payload Details:

   ```
       {
            "cardName": string, //Card name (required)
            "images": {
                "imgFileName": string, //Image link or image filename. (required)
                "imgCropFileName": string //Image link or image filename. (required)
            },
            "references": {
                "originalSources": {
                    "img": string, //Original image link. (Optional)
                    "imgCrop": string, //Original image link. (Optional)
                    "dataSource": string //Original link of the card. (Optional)
                },
                "tcgPlayer": string, //URL of the card in tcgPlayer for additional reference. (Optional)
                "cardMarket": string //URL of the card in cardMarket for additional reference. (Optional)
            },
            "dateReleased": {
                "tcgDate": string, // Date when was the card release in TCG. (Optional)
                "ocgDate": string // Date when was the card release in OCG. (Optional)
            },
            "type": string, //Indication of what type of card it is. (Ex. Spell Card, Trap Card or Monster Card, etc - Required)
            "typing": string, //Indication of what typing of card it is. (Ex. Quick Spell Card, Counter Trap Card or Cyberse Card, etc - Required)
            "archetype": string, //Attack points of a card. (Default null if no archetype provided. Cards can have no archatype.)
            "attribute": string, //Attribute(Ex. Fire, Wind, etc) of a card. (Optional since not all cards Attributes.)
            "levelOrRank": string, //Level or Rank of a card. (Optional since not all cards have Level or Rank.)
            "attack": string, //Attack points of a card. (Optional since not all cards have attack points.)
            pendulumText: string, //Pendulum card effect. (Optional since not all cards are Pendulumg card).
            "cardText": string //Card effect description (required)
        }
   ```

   When performing an update, 1 or all fields can be present.

5. DELETE CARD BY ID - `/cards/<insert archetype id>`

# Technologies Used

- <kbd>[cors](https://www.npmjs.com/package/cors) - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.</kbd>
- <kbd>[dotenv](https://www.npmjs.com/package/dotenv) - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.</kbd>
- <kbd>[express](https://www.npmjs.com/package/express) - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.</kbd>
- <kbd>[express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize) - Express 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.</kbd>
- <kbd>[express-rate-limit](https://www.npmjs.com/package/express-rate-limit) - Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset. Plays nice with express-slow-down and ratelimit-header-parser.</kbd>
- <kbd>[express-xss-sanitizer](https://www.npmjs.com/package/express-xss-sanitizer) - Express 4.x middleware which sanitizes user input data (in req.body, req.query, req.headers and req.params) to prevent Cross Site Scripting (XSS) attack.</kbd>
- <kbd>[helmet](https://www.npmjs.com/package/helmet) - Helmet helps secure Express apps by setting HTTP response headers.</kbd>
- <kbd>[hpp](https://www.npmjs.com/package/hpp) - Express middleware to protect against HTTP Parameter Pollution attacks</kbd>
- <kbd>[mongoose](https://www.npmjs.com/package/mongoose) - Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.</kbd>
- <kbd>[slugify](https://www.npmjs.com/package/slugify) - Slugifies a String</kbd>
- <kbd>[@types/color](https://www.npmjs.com/package/@types/color) - Typescript types for color library</kbd>
- <kbd>[module-alias](https://www.npmjs.com/package/module-alias) - Create aliases of directories and register custom module paths in NodeJS</kbd>
- <kbd>[@types/cors](https://www.npmjs.com/package/@types/cors) - Typescript types for cors library.</kbd>
- <kbd>[@types/express](https://www.npmjs.com/package/@types/express) - Typescript types for ExpressJS.</kbd>
- <kbd>[@types/node](https://www.npmjs.com/package/@types/node) - Typescript types for NodeJS.</kbd>
- <kbd>[colors](https://www.npmjs.com/package/colors) - Set color and style in your node.js console</kbd>
- <kbd>[morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for node.js</kbd>
- <kbd>[nodemon](https://www.npmjs.com/package/nodemon) - Nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.</kbd>
- <kbd>[ts-node](https://www.npmjs.com/package/ts-node) - ts-node is a TypeScript execution engine and REPL for Node.js. It JIT transforms TypeScript into JavaScript, enabling you to directly execute TypeScript on Node.js without precompiling. This is accomplished by hooking node's module loading APIs, enabling it to be used seamlessly alongside other Node.js tools and libraries.</kbd>
- <kbd>[ts-node-dev](https://www.npmjs.com/package/ts-node-dev) - It restarts target node process when any of required files changes (as standard node-dev) but shares Typescript compilation process between restarts. This significantly increases speed of restarting comparing to node-dev -r ts-node/register ..., nodemon -x ts-node ... variations because there is no need to instantiate ts-node compilation each time.</kbd>
- <kbd>[typescript](https://www.npmjs.com/package/typescript) - TypeScript is a language for application-scale JavaScript. TypeScript adds optional types to JavaScript that support tools for large-scale JavaScript applications for any browser, for any host, on any OS. TypeScript compiles to readable, standards-based JavaScript.</kbd>
