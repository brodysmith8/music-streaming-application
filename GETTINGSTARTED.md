# How to get this working? 
It's broken down by OS so you both can get use out of this guide  

# Windows
**1.** Go here, download PostgreSQL 14.6: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads.  

The reason we're using PSQL 14 is because the operating system our AWS Relational Database Service virtual machine will be running is called "Amazon Linux 2". This is the same OS as the default t2.micro machine on EC2. This OS offers built-in "extras", and one of those extras is Postgres 14. Postgres 15 is really new, so it's not yet supported.  

If you want to learn more about this, two links are below. You can see all services by typing in "amazon-linux-extras" to your shell when you're SSH'd into an EC2 virtual machine. 

*Resources*
1. https://aws.amazon.com/premiumsupport/knowledge-center/ec2-install-extras-library-software/   
2. https://aws.amazon.com/amazon-linux-2/faqs/#Amazon_Linux_Extras  

**2.** Leave the default settings and just keep clicking next. Note the password you use for the postgres account somewhere.  

**3.** Leave the default settings and just keep clicking next. 

Note the password you use for the postgres account somewhere. Also I would recommend keeping it short because you'll need to enter it frequently.

**4.** When the program has finished installing, uncheck "launch stack builder at exit", then click finish.  

**5.** Open task manager, make sure you're in the "more details" mode. Type "po", then you should be shown a PostgreSQL Server process. This means your computer has a Postgres server actively running on it.

**6.** Type "Services" in the windows search bar. Under "Services (Local)" type "p", then navigate to the entry called "postgresql-x64-14".  

On your computer, there is a lot of constantly-running background processes. On Windows, these constantly-running background processes are called *services*. In Linux and other UNIX operating systems, constantly-running processes are called *daemons* (pronounced "demon").  

*Services* are the core of adding functionality to operating systems. They allow programs to use the functionality of other programs. In fact, back-end web servers operate using services to perform actions based on user requests (e.g. HTTP requests) that comes in at random times. Note that Linux and other UNIX operating systems have a different meaning for "services" than windows does. https://askubuntu.com/questions/192058/what-is-technical-difference-between-daemon-service-and-process  

**8.** Type in "env" to the windows search bar, click on "edit the system environment variables". Click the "environment variables" button, then under the bottom window "system variables", go to the entry called "Path". Double click it. Click "new", then write `C:\Program Files\PostgreSQL\14\bin`. Close your CMD and open a new one.  

For future reference: whenever you install a new program with a command line command, like `psql`, sometimes you will have to add a new entry to the `Path` environment variable just as we did before. When you type `psql` into the terminal, really you are activating a program called `psql.exe` somewhere on the computer. The `Path` env variable just tells the computer where to look for the location of that program. When we tell it to point to `C:\Program Files\PostgreSQL\14\bin`, this is because the program `psql.exe` that we want to run every time we type in `psql` to the `Path` environment variable is located here.  

Since this is a system-wide change, you need to restart the terminal and open a new one to have the new `Path` environment variable loaded into the shell's environment. Sometimes, depending on program complexity, a system reboot will be required. If you ever install something and you need the command line command for it and it doesn't work, restart first, and if that doesn't work, then look into environment variables.  

**9.** Skip to [both](#both)

# Mac
Sorry Saif I spent way too much time writing the windows section and the both section and I have to set up 3309 database today so just follow [this guide](https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/) until  

# Both
**1.** Open a command prompt, and type `psql U postgres`. This ensures that the user (`-U`) we log into the database as is the admin account (`postgres`) that we created earlier. Enter the password for the postgres account. You are now in the interactive terminal provided by the postgres service. To exit, you can press `ctrl + c`. This is the case for many command line programs, just for note. You can run `psql --help` for more info.

**2.** Now we are actually able to execute SQL commands; we are directly interfaced with the DBMS. We are going to create a table now in accordance with our downloaded data set (from lab 3). The table will be all the tracks from `raw_tracks.csv`. The table should have the same column headings (called *fields* in databases) as our csv data file.  

**3.** There is a lot of columns, so open `raw_tracks.csv` in excel, highlight the row with all the columns, then paste into a new text file in VSCode (just go to the "explorer" pane, right click, click "new file", then name it something like `random.txt`). In VSCode in the top bar, click edit -> replace. In the "Find" input box, click the ".*" button for enabling searches with regular expression capabilities. In find, enter "\t" for "tab", which is the character that delineates the column headings. In replace, enter ",\n" to replace the tab with a comma and a new line. Then click the replace all button, which is the second button to the right of the "replace" box. Now you have all the column headings in the format you need for the SQL command. Remember to add a comma after the last entry.

**4.** To create a table, the SQL command is the following (note that the square brackets indicate optional fields):  

```
CREATE TABLE name (
    field1 TYPE [CONSTRAINTS], 
    field2 TYPE [CONSTRAINTS], 
    ... , 
    fieldN TYPE [CONSTRAINTS],
    PRIMARY KEY (fieldX)
    FOREIGN KEY (fieldY) 
        REFERENCES parent(parent_column)
        [ON DELETE delete_action]
        [ON UPDATE update_action]
);   
```    

We will use **a copy of** `random.txt` to form all of our fields, their types, and their constraints, so we don't have to enter each field in the terminal one-by-one. Make all fields' datatypes `INT` for numbers or `UNLIMITED VARCHAR` for strings. `VARCHAR` normally takes an argument (n) where n is the number of bytes you can store in the cell, but unlimited means it can take the max amount of characters. Probably dangerous in practice but good when you don't have a specific size of the entry. 

I used `text` datatype in my original DB, but `INT` and `VARCHAR` are part of "ISO standard SQL" which we have to use in 3309. The point of this is that the database is portable between different DBMS services. Doesn't really matter in our case, but I see the point.  

Add the constraint `NOT NULL` after `track_id`'s datatype. In the psql interactive terminal, type `CREATE TABLE tracks(`, press enter, then highlight everything, copy with `ctrl + c` (make sure the | is at the end of `track_url VARCHAR` and not on the next line), then paste it into the shell with `ctrl + v`. Press enter again. Add `track_id` as the primary key. Enter again. Finish it off with `);`. If successful, the DBMS will return "CREATE TABLE". You can verify everything is right by typing `SELECT * FROM tracks WHERE false`, which will return all column names. 

We'll handle foreign keys later. Right now if you tried to add them you'd probably get errors because the referenced fields don't exist because the tables don't exist.   

**5.** Now we can actually import data. Open pgAdmin 4. Click File -> Preferences. Scroll down to Paths -> Binary paths. Scroll down to "PostgresQL Binary Path". Click the folder icon for PostgreSQL 14. Navigate to the binary folder for PostgreSQL 14 (whereever PSQL is located). Click "set as default". Save.  

Now, In the left pane, click "servers". Enter postgres user password. Expand "Databases", "Schemas", "Tables". Right click on tracks, click "import/export data". Reference the `raw_tracks.csv` file downloaded from lab 3. Go to options, remove the value for "escape". This and the "quote" value are a source of some problems with other tables so play with these as necessary. Check the "header" button. Import.  

**6.** Now, create the rest of the data tables (call the tables `artists`, `albums`, and `genres`). You can use pgAdmin to do this by right-clicking "tables" -> "create table", fill out the name, go to "columns" tab, add all the column names + data types. "constraints" tab will let you set PKs.