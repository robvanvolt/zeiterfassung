import { HandlerContext } from "$fresh/server.ts";
import { DataTypes, Model } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";
// hier wird die Datenbankverbindung importiert
import { db } from './db.ts';

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

db.link([RawTracking]);
await db.sync({ drop: false });

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
  const params = await _req.json();
  const ym = params.ym;
  const value = params.value;
  const day = params.day;
  const category = params.category;

  const data = await RawTracking.where('ym', ym).get();
  // @ts-ignore: Object is possibly 'null'.
  const item = data.find((item) => item.ymd === day);
  if (item) {
    item[category] = value;
    await item.update();
  } else {
    await RawTracking.create({
      ym: ym,
      ymd: day,
      [category]: value,
    });
  }

  const body = JSON.stringify(params);
  return new Response(body);
};
