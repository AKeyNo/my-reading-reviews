# My Reading Reviews

A book tracker using the Google Books API Family where users are able to keep track of their readings and leave book reviews.

## Prerequisites

Make sure that you have installed [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/).
A [Supabase](https://supabase.com/) account is required.

## Supabase Setup

Create a blank new project.

Copy the init.sql file under ./sql/init.sql into the SQL Editor.

Keep track of your Project URL and your anon public key which is found under Project Settings and then API.
You will put this under your .env.local file later.

Choose either the normal installation or the Docker installation below to continue.

## Normal Installation

In your favorite shell, type the following in order to setup the project.

```
git clone https://github.com/AKeyNo/my-reading-reviews.git
cd my-reading-reviews
npm install
```

Fill out the ".env.local example" file and rename the file name to ".env.local".
Input the Project URL key and the anon public key from earlier under their respective places.
Set up a [Google Books API Family key](https://developers.google.com/books/docs/v1/using) and input your API Key in the .env_local file.
After this, type in the following command to run it.

```
npm run dev
```

After running these commands, it will be on http://localhost:3000/.

## Docker Installation

In your favorite shell, type the following in order.

```
git clone https://github.com/AKeyNo/my-reading-reviews.git
cd my-reading-reviews
```

Fill out the ".env.local example" file and rename the file name to ".env.local".
Input the Project URL key and the anon public key from earlier under their respective places.
Set up a [Google Books APIs key](https://developers.google.com/books/docs/v1/using) and input your API Key in the .env_local file.
After this, type in the following commands.

```
docker build -t my-reading-reviews .
docker run --env-file ./.env.local -p 3000:3000 my-reading-reviews
```

After running these commands, it will be on http://localhost:3000/.

## License

My Reading Reviews is released under the MIT License. Check the [LICENSE](https://github.com/AKeyNo/my-reading-reviews/blob/main/LICENSE) file for more information.
