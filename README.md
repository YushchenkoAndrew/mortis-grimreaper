# Mortis-Grimreaper

## A simple frontend application written with React & NextJS, which is used for hosting/displaying personal web project & interacting with microservice system / dynamically uploading them

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