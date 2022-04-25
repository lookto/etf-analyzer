# etf-analyzer

## What is the etf-analyzer?
ETF-Analyzer is a small web app for, like the name suggests, analyzing your (future) ETF portfolio.

I developed this idea after wanting to visualize my ETF portfolio to see it's diversification across countries, markets and industries and not finding any lightweight free tools online to satisfy my needs. My first approach - doing it in a spreadsheet, manualy importing every single ETF datapoint by hand - was not the best solution, so I started building this as my first JS project ever!

## Disclaimer
This is my first fullstack project and also my first project using 
* Javascript 
* NodeJS 
* Sequelize
* Docker

I learned a lot during this journey, wich resulted in many refactoring cycles. At least 7 for the datacrawler if we can trust my commit messages. 😅

Also this is my first time realy working with git and github (besides of cloning some OSS). Many mistakes were made (and hopefully fixed). What a ride!

# Table of contents

- [Features](#features)
- [Stack](#stack)
- ["Why didn't you use Typescript?"](#"why-didnt-you-use-typescript")
- [Packages](#packages)
  - [DataCrawler](#datacrawler)
  - [REST-Api](#rest-api)
  - [WebApp](#webapp)

# Features

1. ### **Easy to use**
   Use the intutive ui design to easly add new ETFs. If you can manage your portfolio - you can use this tool.
2. ### **Privacy friendly**
   ***Finacial data is sensible data***. That's why all the data handling and calculation regarding your portfolio is done in your browser. The API only supports GET request for the web app to get the basic ETF data that is needed. At no point the API requests will be used to analyze user behavior.
3. ### **Clutterfree**
   Similar tools are often packed with features - which most of the times only <5% of users need. This makes the user experience not as enjoyable as it could be. My approach is to just do one thing and improve it as much over time as I can, hoping that this also contributes to the ease-of-use.
4. ### **It's free**
   Do I have to say more? Ok, I will. In my opinion, financial education can be a tool to ensure financial security, prosperity and progress. ETFs allow people who are not as privileged as others to work towards these goals and participate in societal prosperity, even if with smaller steps. Access to tools that support this development should, in my opinion, be available to everyone, not just people who can afford it financially.

# Stack

* NodeJS
* Sequelize [^1]
* MySQL [^2]
* ExpressJS
* Docker
* ReactJS
* Axios

[^1]:
  When i first googled ORMs for NodeJS, Sequelize seemed to be good. If I would start over I would propably lean towards Prisma.
[^2]:
  Mainly because I was already familiar with using it since its my daily bread and butter.

# "Why didn't you use Typescript?"

Because this project is a lot of "first times" and I felt like learning TypeScript on top of learning Javascript would have been to much. But there will propably be a time where i refactor this code to be typesafe.

# Packages
## DataCrawler
- Weekly crawling all monitored ETFs by getting the spreadsheets, mapping the data and calculating totals for countries and sectors.
- Supported ETF providers:
  - Xtrackers (dws)
## REST-Api
- Provides the calculated etf data to the web app.
### Routes
- **GET** /etf
- **GET** /provider  
- **GET** /provider/:id
- **GET** /provider/:id/etfs
- **GET** /index
- **GET** /etfdata/:id
## WebApp

-- in production --

# Changelog

## v0.1-alpha

### Added or Changed
- Added the first version of the data crawler, supporting ETFs issued by Xtrackers (dws).
- Added 206 Xtracker ETFs to be tracked.