[![build](https://github.com/codeforlansing/cityzen-server/workflows/build/badge.svg)](https://github.com/codeforlansing/cityzen-server/actions?query=workflow%3Abuild)
[![version](https://img.shields.io/npm/v/@codeforlansing/cityzen-server.svg?sanitize=true)](https://www.npmjs.com/package/@codeforlansing/cityzen-server)
[![license](https://img.shields.io/npm/l/@codeforlansing/cityzen-server.svg?sanitize=true)](https://github.com/codeforlansing/cityzen-server/blob/master/LICENSE)

## CityZen Server

Welcome to CityZen, a volunteer management program. We've built CityZen for [The Fledge.](https://thefledge.com/) The Fledge describes itself as “a one-of-a-kind radically inclusive Ideation Space, Maker Space, Incubator and Accelerator on a mission to create opportunities to pursue happiness.” They work with two types of volunteers, people who are active in one of their projects and parolees fulfilling a community service commitment mandated by the court.

CityZen is comprised of three parts: the server, Trello and the client. The client retrieves projects and tasks from Trello then displays them on your site. When a volunteer selects a task and adds his or her email the client then sends it to the server. The server both records the information and sends an email to the volunteer coordinator.

Cityzen itself operates both in the background as well as supplying a reporting component. The group volunteer coordinator receives an email and schedules an appointment for the volunteer. If it's a new volunteer and the group is using either HubSpot or MailChimp their contact information will be added.

Staff can setup a project and tasks in Trello. They can drag or drop the project cards in the order they want them to appear on their website. If you don’t want to install the client there is a CDN driven page you can put on your website and then just simply link to it. Full details on the [client](https://github.com/codeforlansing/cityzen-client-vue) site.

### Installing the server

The CityZen client is built using Vue.js. The server backend is Node.js with a SQL Lite database.

> **Tip:** CityZen requires a fairly recent version of both npm and Node.js. To install both go here: [Get NPM](https://www.npmjs.com/get-npm)   For reference when these docs were written we were using version 12.18.1 of Node.js and version 6.14.5 of npm.

To install CityZen first create the directory CityZen-Server. From the command prompt:

``` sh
md CityZen-Server
```

Navigate to the directory CityZen-Server and then at the command prompt type:

``` sh
npm init
```

Then you have to answer a series of questions about the project. Next to install the server you want type on the command line:

``` sh
npm i @codeforlansing/cityzen-server
```

Or alternately you can install using npx:

``` sh
npx @codeforlansing/cityzen-server
```

### Setting up Trello

Here's how to create an account on Trello and create your first project. Sign up for Trello by selecting the signup link at the top right of the home page at [https://www.trello.com](https://www.trello.com) Now it asks for you to enter your email. After hitting continue you're presented with a second page that asks for your name and asks you to enter a password. Note the password must be eight characters long or you cannot proceed.

Now we're ready to create 'cards' which in Trello which will represent your projects. In each project you can list individual tasks. Trello calls the card titles lists. So creating a list is naming a card. Then you're asked to add a card which is what Trello calls adding a task.

By grabbing the titles of the cards you can drag them around to change their order. So if you have a new project and want it to be first on your web page drag it to first in Trello and it will be reflected on your website. If you're interested in video tutorials for advanced Trello topics you can find them [here.](https://blog.trello.com/press-play-the-trello-tutorial-video-series-is-here)

## Questions

Complete documentation for the CityZen Project: [https://github.com/codeforlansing/cityzen-docs](https://github.com/codeforlansing/cityzen-docs)

For general support, direct your questions to the code4lansing channel in the [Lansing Codes Slack](https://lansingcodes-slackin.herokuapp.com/) team. The issue list for this project is exclusively for bug reports and feature requests.

Stay in touch

*   [Slack](https://lansingcodes-slackin.herokuapp.com/) (join the `#code4lansing` channel)
*   [Facebook](https://www.facebook.com/code4lansing/)
*   [Website](https://codeforlansing.org/)

## Contribution

You are welcome and encouraged to make changes to this website by submitting pull requests or forking our code to make your own community website! Before you get ahead of yourself, though, please read our [Contributing Guide.](https://github.com/codeforlansing/cityzen-server/blob/master/.github/CONTRIBUTING.md)

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2019-present, Code for Lansing
