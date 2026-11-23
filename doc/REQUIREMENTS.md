# Fantasy Basketball XYZ application Requirements

## Documentation 
- Generate and udpate archetectual diagrams for understanding and to be reviewed in draw.io when needed

## General
- Token effenciy
- will run applicaiton locally to save tokens
- Write and execute tests for exhastive code coverage for all code using jest
- Typescript
- Production ready, effiecent design patterns and algorithms
- conceice and well commented code
- SEO, and AGENT search optimization

## Backend
- nodejs runtime

### NBA Stats fetching
- The applicaiton will make use the balldontlie paid api for requesting real time stats, play by play, player news, and team news.

### Appwrite
- The application will use of appwrite.io for it's databasae.
- The application will use appwrite.io for game logic using serverless funcitons, CRON jobs, and database events.
    
    1. initially create a nodejs backend first, to run and test locally, before converting game logic to serverless functions.

- Utilize stripe for purchases

#### Game Logic
- The User selects a weekly lineup up to one week in advance.
- Lineup locks at 0500 PST each Monday. This starts the new week.
- 7 total players in lineup. PG, SG, SF, PF, C, Sixth Man, Sub
- The user accrues fantsy points (fpts) based off selected player lineup in game stats. Pts, reb, ast, stl, blk, - (negative) turnovers
- Leaderboard View: weekly, monthly, season leaderboard that ranks users.
- Tie breaker priority: previous weeks average placement on leaderboard. if average placements are equal, randomize which order the tied users are on the leaderboard.

## User Interface
- Prmary color pallete orange and blue.
- Light mode and dark mode
- The user shall be able to select a lineup of 5 palyers, a sixth man, and a sub.
- The user shall be able to view 
- Menu bar: Home, Leaderboard, Games, News, Stats, Standings, My Legues
- Home View will display weekly lineup and allow user to make lineup changes when the game week is active and lineup changes are enabled. Also to display his players stats to make inforemed decesions during selectiona nd to view how the players are doing during the game week.
- Leaderboard View: weekly, monthly, season leaderboard that ranks all users.
- Games View: display a court a tthe top with time and score. A feed for play by play. A stats section for box scores. A chat section for users to chat.
- Leagues View: Player may view and create leauges that to compete weekly using his set lineup agains friends/others. Seperate leaderboard from the gloabl game leaderbard
- Responsive to different screen sizes.
- The user will receive real time updates across multiple sessions.
- login view. Utilize appwrite features for single signon or other methods
- Ads display in each view inline but not annoyingly.

### Monetization
- Ads to earn income. need to learn more about this before executing the milestones associated with it
- Paid subscription teirs for user accounts to opt out of ads
        
    1. **Lite**: Full ads - free
    2. **Rookie**: Monthly subscrition - $4.80
    3. **Pro**: Season long subscription. Start of pre-season to end of NBA finals - $
    4. **All-Star**: Yearly subscription. Subscription for the whole year.
    5. **Legend**: Lifetime subscritption. $98.60


### Legal && compliance
- Will likely never have official league licensing. So it may be neccessary to not inculde player images and team logos.

    1. Create Team logo svgs based off city abbrieviation and colors
    2. Create player logos as jersey svgs with name and number

### Claude
- Anything else that is useful to know when developing
