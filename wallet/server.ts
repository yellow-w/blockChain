import express from 'express';
import nunjucks from 'nunjucks';

const app = express();
app.use(express.json());
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
});

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3001, () => {
    'wallet server running on port 3001';
});
