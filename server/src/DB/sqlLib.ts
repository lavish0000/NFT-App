import { Pool, PoolConfig, QueryResult } from 'pg';

const db_config = {
	host: process.env.PGHOST,
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	max: 20,
};

function initializeConnectionPool(db_config: PoolConfig) {
	console.log('CALLING INITIALIZE POOL');
	const pool = new Pool(db_config);
	return pool;
}

const connection = initializeConnectionPool(db_config);

export function executeQuery(event: string, queryString: string, params: any): Promise<QueryResult> {
	return new Promise((resolve, reject) => {
		connection.query(queryString, params, function (err: Error, result: QueryResult<any>) {
			console.info('QUERY:' + event);
			console.log('PARAMS', params);
			console.log(' --->', queryString.replace(/\n/g, ''));
			if (err) {
				console.error('ERROR:', err);
				return reject({
					ERROR: err,
					QUERY: queryString,
					Event: event,
				});
			}
			console.log('TOTAL RESULTS:', result.rowCount);
			return resolve(result);
		});
	});
};
