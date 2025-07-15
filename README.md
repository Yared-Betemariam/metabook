# Welcome to Metabook

A simple trade journaling application with AI assistance for analaysis and statistics.

## Features

- Calendar Mode - shows your trades in a calendar
- List mode
- AI analysis report and feedback

## Database Tables

- User
  - id (int autoincrement primary_key), email (text), name (text), created_at(timestamp)
- Trade
  - id (int autoincrement primary_key), acctount_id (int), pair (text), date (timestamp), bias (text), point_of_interest (enum of eq, qb, fvg), outcome (enum of win, loss), pnl, chart (text)
- Accounts
  - id (int autoincrement primary_key), user_id (int), name (text), balance (float), description (text default NULL)

## Pages

- Landing page - Hero, Simple Stats, Feature, Get Stared, Footer
- Sign-in - Login with Google (simple)
- Settings - change profile settings
- Dashboard
- Trades
  - List overview - list of trades with simple stats
  - Calendar overview - trades shown in calendarly format
- Analysis
- AI Assistant - chat with ai
- Reports - reports of your progress
  - Instruments - Trade distubutions and PNL change by each trading pair
  - Dates - Trade distubutions and PNL change by days, weeks, months

## Tech Stack

Nextjs, zustand, next-auth, drizzle,
