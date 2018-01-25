# costumes-api

## Install
1. Run `npm install`
2. Start in dev mode: `npm run dev`
3. Start in prduction mode: `npm start`

## Project Requirements
You will be tasked with building an API from scratch. This API should:
* Follow RESTful patterns
* Use an opinionated architecture (e.g. MVC)
* Include error handling
* Include nested resources
* Stores data in a file (e.g. .json, .csv)
* You may optionally test your project.

### Costume Shop
Build an API that represents products in a costume shop!

#### Costumes
* ID: (You Choose) A unique id that represents the costume. Created automatically.
* Name: (String) Name of the costume. Required.
* Price: (Number) Price of the costume. Cannot be less than 1 cent. Required.
* Description: (String) A description of the costume. Optional.
* Tags: (Array) An array of tags.
#### Tags
* ID: (You Choose) A unique id that represents the tag. Created automatically.
* Name: (String) Name of the tag. Cannot be longer than 10 characters. Required.
* Color: (String) A color to be associated with the tag. Must be a valid hex color code (e.g. #123456). Optional.
* Tags will have different IDs even if they have the same name and color.
#### Build RESTful routes so that you can:
* Create, Read, Update, and Delete costumes
* Create, Read, Update, and Delete tags through costumes