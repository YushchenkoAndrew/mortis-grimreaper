# Mortis-Grimreaper

## A simple frontend application written with React & NextJS, which is used for hosting/displaying personal web project & interacting with microservice system / dynamically uploading projects

This microservice project is a **Part 1** of **'Web-Based Project Management System'**. 
 * [Part 1 'WEB Server'](https://github.com/YushchenkoAndrew/mortis-grimreaper)
 * [Part 2 'API Server'](https://github.com/YushchenkoAndrew/grape)
 * [Part 3 'File Server'](https://github.com/YushchenkoAndrew/void)
 * [Part 4 'bot'](https://github.com/YushchenkoAndrew/botodachi)

![System](/public/img/System.jpg)

 So I guess you wondering, why I called it *'mortis-grimreaper'*. Ehh, because it's the dns name of my website is [mortis-grimreaper.ddns.net](https://mortis-grimreaper.ddns.net/projects), you know quite logical to name the project like this..., right ?

Anyway, this project is a user interface for interacting with whole microservice system **'Web-Based Project Management System'**.


What's currently created:
* Frontend
  * /projects -- Home page / About me *[Need to fix some small issues with email]*
  * /projects/projects -- Dynamically loading project thumbnails from **API Server**
  * /projects/info -- Show user statics *Country, etc*
  * /projects/{name} -- Parse template HTML/Markdown file or redirect user to another Docker container
  * /projects/admin -- Admin home page *[Not implemented yet]*
  * /projects/admin/login -- Login in admin panel
  * /projects/admin/logout -- Simple logout with redirect to Home page
  * /projects/admin/projects -- Dynamically loading project thumbnails from **API Server**
  * /projects/admin/projects/create -- Here admin can create/upload **HTML/Markdown/Link/Docker** project
  * /projects/admin/projects/update/{name} -- Update created project
  * /projects/admin/projects/metics/{name} -- Displaying Docker pod metrics
  * /projects/admin/settings -- Contain a whole system settings *[Not implemented yet]*

* Backend
  * **[GET]** /projects/api/ping -- Simple ping/pong request
  * **[POST]** /projects/api/email -- Send an email
  * **[POST]** /projects/api/yaml -- Convert yaml -> json & json -> yaml
  * **[PATCH]** /projects/api/view/click -- Count how many times user clicks on any link
  * **[PATCH]** /projects/api/view/media -- Count how many times user clicks on personal media (twitter/github/etc)
  * **[PATCH]** /projects/api/view/page -- Count how many times user opened projects
  * **[HEAD]** /projects/api/view/ping -- Check if user id exists in the system
  * **[HEAD]** /projects/api/view/rand -- Generate temp random salt
  * **[POST]** /projects/api/view/user -- Generate unique user_id based on his country name and save it in system
  * **[GET/POST/DELETE]** /projects/api/admin/cache?id=:id  **{ auth }** -- Get/Save/Delete admin last state
  * **[POST]** /projects/api/bot/redis?key=:key  **{ x-custom-header: :salt }** -- Send commands directly to Redis by Bot system
  * **[GET]** /projects/api/colors/load **{ auth }** -- Load colors records from **API Server** *[In progress]*
  * **[POST]** /projects/api/colors/{handler} **{ auth }** -- Create/Update colors records with **API Server**
  * **[POST]** /projects/api/colors/delete **{ auth }** -- Delete color record from **API Server**
  * **[POST]** /projects/api/docker/build?tag=:tag&path=:path **{ auth }** -- Send request to **Filer Server** to build Docker image
  * **[POST]** /projects/api/docker/push?tag=:tag **{ auth }** -- Push prebuild Docker image to DockerHub with **File Server**
  * **[GET]** /projects/api/file/load?path=:path **{ auth }** -- Load file from **File Server**
  * **[POST]** /projects/api/file/tmp?role=:role&dir=:dir **{ auth }** -- Save user live changes in */tmp* directory at **File Server**
  * **[POST]** /projects/api/file/{handler}?id=:id&project=:project&role=:role&path=:path&project_id=:project_id **{ auth }** -- Save/Update file information at **API Server** and load file to **File Server**
  * **[POST]** /projects/api/file/del **{ auth }** -- Delete file record from **API Server** and remove file from **File Server** *[In progress]*
  * **[GET]** /projects/api/analytics -- Get some basic users analytics
  * **[GET]** /projects/api/statistic -- Get users country statistic
  * **[POST]** /projects/api/k3s/{handler}?type=:type **{ auth }** -- Set up/Update Kubernetes environment for Docker image based on yaml config with **API Server**
  * **[POST]** /projects/api/k3s/exec **{ auth }** -- Execute a specific command inside Docker container *[Not implemented yet]*
  * **[GET]** /projects/api/k3s/read **{ auth }** -- Get Kubernetes environment info from **API Server**  *[In progress]*
  * **[POST]** /projects/api/k3s/metrics/{handler} **{ auth }** -- Send a request to **API Server** for generating a cron job that will check Docker container status
  * **[POST]** /projects/api/link/{handler} **{ auth }** -- Create/Update link record with **API Server**
  * **[POST]** /projects/api/link/del **{ auth }** -- Delete link record with **API Server** *[In progress]*
  * **[POST]** /projects/api/pattern/{handler} **{ auth }** -- Create/Update pattern record with **API Server**
  * **[POST]** /projects/api/pattern/delete **{ auth }** -- Delete pattern record from **API Server**
  * **[GET]** /projects/api/pattern/load **{ auth }** -- Get pattern records from **API Server**
  * **[POST]** /projects/api/projects/{handler} **{ auth }** -- Create/Update projects record with **API Server**
  * **[POST]** /projects/api/projects/delete **{ auth }** -- Delete project record from **API Server** *[In progress]*
  * **[GET]** /projects/api/projects/load **{ auth }** -- Get project records from **API Server**


## Diagram
![Diagram](/public/img/Frontend.jpg)

### Flowchart for creating a project
![Diagram](/public/img/Attach3.jpg)

## How to use this project

1. Clone this repo
2. Copy .env.local to .env
```
cp .env.local .env
```
3. Configure a .env
4. Start the project
```
npm run dev
```

Now you can just open a browser and visit http://127.0.0.1:8000/projects/projects

## Found a bug ?
Found something strange or just want to improve this project, just send a PR.

## What's not implemented yet / Known issues
- [ ] - Deleting a dynamic project
- [ ] - Redux is too slow with tree structure
- [ ] - Revisit email ingression
- [ ] - Revisit user statics page