# Full-Stack Music Streaming Application
### By [Ahmad El-Zein](mailto:aelzein2@uwo.ca), [Saif Ahmad](mailto:sahma244@uwo.ca), [Brody Smith](mailto:sahma244@uwo.ca) on December 2, 2022  

# Technologies Used
Todo  

# Getting Started  
I've been writing all morning - I kind of went too deep into things that are only partially related and I really have to move on to 3309 soon so I don't have time today to finish the [getting started guide](GETTINGSTARTED.md), but you can read it if you want.  

1. use this guide (download postgres 14, not 15) and stop before the heading "creating a table in Postgres": https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/. Ahmad it doesn't say it in the guide but you will need to change your Path environment variable by typing in "env" to the windows search bar, clicking "edit system env variables", click "environment variables" button, in the box on the bottom scroll down to "Path" and double click it. Click "new" and add `C:\Program Files\PostgreSQL\14\bin`. Restart your command prompt and `psql` should work. If it doesn't, restart and try again.  

2. use pgAdmin 4. Click "servers" in the left pane, log in with your postgres user password, expand databases, expand api. Right click api, and click "restore". Have the filename input point toward [this file](https://uwoca-my.sharepoint.com/:u:/g/personal/bsmit272_uwo_ca/EdQywadmGzlLhhDdLqrRU9IBhV_x7SrnwDg-4F3r8oSp2w?e=UJbV2R) (download it onto your pc first obviously) and just leave everything else alone and click restore. It will say it fails, but it's because you guys don't have a user named "brody" which is the postgres username I created my local db with. This will copy my local db to both of your computers. Note that they are not linked; these are static databases. Changes I make on my local computer wont affect either of you and vice versa.  

    You can verify data is there by expanding "schemas" under "api" database in the left pane, then "tables", then right click whatever table and click "view/edit data" -> all rows. They all should be the same number of rows minus one (because the tables don't have the header rows like the csvs do) as the csv files.  

    I want to reoptimize this database so we can use more SQL functionality (I didn't really set up foreign keys properly so there's a lot of missing links rn). I will do this today or tomorrow after I break ground on 3309.  

3. To make the web app work, open two terminals, cd to the root folder of this repository on both terminals. On one, cd into "server" folder. Write `npm install package.json`.  

4. Now edit `app.js` in server folder and replace it with your postgres user password on line 20. **Make sure to remove this password and replace it with `'pw goes here'` or an empty string when you commit to github so it doesn't leak your password**, or don't if you made it a dummy password.  

5. Now, in the terminal you just installed the package with, type `nodemon app.js`. You should get a terminal output that says `Listening on port 3000...`. This means two things:  
    a) the backend is working and ready to accept requests, and  
    b) index.html is being served at localhost:3000. Enter just that (no prefix) into a browser and check. Some things might be broken because I've had to make a lot of on-the-fly changes for deployment to my AWS server for lab 3.  

6. If the playlists display on `localhost:3000`, then your database connection is established properly.