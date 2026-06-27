require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.locals.siteName = process.env.SITE_NAME || 'MCCommands';
app.locals.siteDesc = process.env.SITE_DESC || 'Minecraft command list API for every version';
app.locals.companyName = process.env.COMPANY_NAME || 'LogicByte Studios LTD';
app.locals.companyUrl = process.env.COMPANY_URL || 'https://logicbyte.org';
app.locals.githubUrl = process.env.GITHUB_URL || 'https://github.com';

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`${app.locals.siteName} running on http://localhost:${PORT}`);
});
