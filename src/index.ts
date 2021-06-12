import process from 'process';
import express, { json, urlencoded } from 'express';
import { Database } from './database';
import { createForm, link, notFound } from './templates';

const app = express();
const port = process.env.PORT || 8080;
const base = process.env.BASE_PATH || '/';
const host = process.env.HOST || 'https://u.mun.sh';
const dbPath = process.env.DB_PATH || 'urls.db';
const db = new Database(dbPath);

app.use(json());
app.use(urlencoded({ extended: true }));

app.get(`${base}`, async (req, res) => {
	res.status(200).send(createForm);
});

app.post(`${base}create`, async (req, res) => {
	console.log(req.body);

	if (req.body?.url) {
		try {
			const [shortUrl] = await db.save(req.body?.url);
			if (shortUrl) {
				return res.status(200).send(link(`${host}${base}${shortUrl.id}`));
			}
		} catch (e) {
			console.error(e);
		}
	}

	res.status(400).send(createForm);
});

app.get(`${base}:id`, async (req, res) => {
	const url = await db.findById(req.params.id);
	if (url) {
		res.redirect(url);
	} else {
		res.status(404).send(notFound);
	}
});

(async () => {
	await db.connect();

	app.listen(port, () => {
		console.log(`App listening at http://localhost:${port}`);
	});
})();
