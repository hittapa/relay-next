<h1>Align | We help frontline technologists solve hard problems for their customers.</h1>
<h2>Align helps sales teams collaborate to find, create, and automatically generate relevant, strategic messaging for specific customer contexts.</h2>

World-changing technology is slowed down by the lack of knowledge cohesion on the frontlines. We're the ones to fix this.

<h2>Team Principles</h2>
<h3>BE BOLD</h3>
<i>Fortis fortuna adiuvat</i>
<h3>BE SCIENTIFIC</h3>
Reinforce decisions with rigorous logic and evidence

Conduct exhaustive research

Stay on top of trends
<h3>BE PROACTIVE</h4>
Strategize and relentlessly execute

Think in terms of results

Always ask: what are the 'first philosophies' driving this?
<h3>EVERYTHING IS A SANDBOX</h3>
The world is yours

Stay creative
<h3>THINK BEYOND DATA</h4>
Always ask: what are the 'first philosophies' driving this?

Think holistically
<h3>FIGURE IT OUT</h3>
People consistently do the impossible

Design the process
<h3>CUSTOMERS SHAPE US</h3>
Align was born to solve real problems, be obsessed with solving them

Make our customers' dreams come true
<h3>ALWAYS BE LEARNING</h3>
Align is a marketplace of ideas

Expand your perspective, don't dig your feet into it
<h3>TAKE RISKS TO INNOVATE</h3>
Evolve or dissolve

Be cautious

<h1>The MVP</h1>
Align's solution is designed to add value to large enterprise sales teams with dedicated enablement functions - this is our beachhead, and we need to prepare our MVP accordingly.

These firms require a significant degree of polish before considering signing contracts - they need assurance that their data is secure, that we will provide uptime, and most importantly, they need to feel like Align is the most premium solution on the market.

To be considered minimally viable, we have to be certified SOC2 compliant, build our core integrations, and be listed on the Okta Integration network, Salesforce AppExchange, the Chrome Web Store, and the Slack App store. This comes after our core functionalities are frictionless (CRUD cats, tags, messages, tagsOnMessages)


### DB launch
docker-compose -f docker-compose-local.yml -f docker-compose.yml up db

### graphql api middleware launch

source .env && export COOKIE_NAME && export PORT && export CORS && export DATABASE_URL && node graphql/src/server.js