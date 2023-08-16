// Import required modules
import { HandlerContext } from "$fresh/server.ts";
import { DataTypes, Model } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";
// hier wird die Datenbankverbindung importiert
import { db } from './db.ts';

// Define a model for the "timetracking" table
class RawTracking extends Model {
	static table = "timetracking";
	static timestamps = true;

	static fields = {
		id: { primaryKey: true, autoIncrement: true },
		ym: DataTypes.INTEGER,
		ymd: DataTypes.INTEGER,
		duty: { type: DataTypes.INTEGER, default: 0 },
		overtime: DataTypes.INTEGER,
		pause: DataTypes.INTEGER,
		workingtime: DataTypes.INTEGER,
	};
}

// Define the model that the RawTracking model gets translated into for the frontend
interface MonthTracking {
	overtime: {
		[day: number]: number;
	};
	pause: {
		[day: number]: number;
	};
	workingtime: {
		[day: number]: number;
	};
}

// deno-lint-ignore no-explicit-any
function parseMonthTracking(data: any[]): MonthTracking {
	const overtime: { [day: number]: number } = {};
	const pause: { [day: number]: number } = {};
	const workingtime: { [day: number]: number } = {};

	data.forEach((item) => {
		const day = Number(item.ymd.toString().slice(-2))
		overtime[day] = item.overtime;
		pause[day] = item.pause;
		workingtime[day] = item.workingtime;
	});

	return { overtime, pause, workingtime };
}

// Link the model to the database
db.link([RawTracking]);

// Synchronize the database schema with the model
await db.sync({ drop: false });

// Define a request handler function
export const handler = async (_req: Request, _ctx: HandlerContext, ym: string): Promise<Response> => {
	// Retrieve all records from the "timetracking" table where the "ym" column matches the input parameter
	const ymdata = await RawTracking.where("ym", ym).all();
	const tracking = parseMonthTracking(ymdata);

	// Return the retrieved data as a JSON response
	return new Response(JSON.stringify(tracking), {
		headers: { "content-type": "application/json" },
		status: 200,
	});
};