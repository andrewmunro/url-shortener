import { Table, Column, Model, PrimaryKey, CreatedAt, Length, IsUrl, Sequelize, Index } from 'sequelize-typescript';
import { generate } from 'shortid';

interface ShortUrlAttributes {
	id: string;
	url: string;
}

@Table
class ShortUrl extends Model<ShortUrlAttributes> {
	@PrimaryKey
	@Column
	id: string;

	@IsUrl
	@Length({ min: 3, max: 100 })
	@Index
	@Column
	url: string;

	@CreatedAt
	creationDate: Date;
}

const idLength = process.env.SHORT_LENGTH ? parseInt(process.env.SHORT_LENGTH) : 4;

export class Database {
	private file: string;
	private logging: boolean;
	private db: Sequelize;

	constructor(file: string = 'urls.db', logging = false) {
		this.file = file;
		this.logging = logging;
	}

	async connect() {
		this.db = new Sequelize({
			dialect: 'sqlite',
			storage: this.file,
			models: [ShortUrl],
			logging: this.logging
		});
		await this.db.sync();
	}

	async disconnect() {
		return await this.db.close();
	}

	async findById(id: string) {
		const shortUrl = await ShortUrl.findOne({ where: { id } });
		return shortUrl ? shortUrl.url : null;
	}

	async save(url: string) {
		return await ShortUrl.findOrCreate({
			where: { url },
			defaults: {
				id: generate().slice(0, idLength),
				url
			}
		});
	}
}
