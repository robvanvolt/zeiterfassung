import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { handler as getTimetracking } from "./api/db-get-data.ts";
import Tabelle from "../islands/Tabelle.tsx";

export const handler: Handlers = {
	// ##################################################################
	// (1) Vor dem Rendern der Seite
	//  ##################################################################
	// Diese funktion wird aufgerufen, wenn die Seite aufgerufen wird
	// Sie kann async sein, um z.B. Daten von einer API zu laden (z.B.a us einer Datenbank, wie bei uns aus de MariaDB)
	// Die Daten werden dann an die Seite übergeben
	// Die Seite wird dann mit den Daten gerendert ('dargestellt')
	// Die Daten werden in der Variable 'data' übergeben

	async GET(_req, _ctx) {
		const searchParams = new URLSearchParams(_req.url.split("?")[1])
		const ym = searchParams.get("ym") || new Date().toISOString().slice(0, 7).split("-").join("");
		const currentDate = new Date(Number(ym.slice(0, 4)), Number(ym.slice(4, 6)) - 1);
		const response = getTimetracking(_req, _ctx, ym);
		const result = await response;
		const tracking = await result.json();
		const data = {
			ym: ym,
			tracking: tracking,
			currentDate
		}
		return _ctx.render(data);
	},
};

export default function Zeiterfassung({ data }: PageProps) {

	// ##################################################################
	// (2) Während des Renderns der Seite
	// ##################################################################
	// Diese Funktion wird nach dem ersten Laden aufgerufen
	// Hier kann data weiter verwendet werden, um bestimmte html Elemente zu generieren
	// Die Funktion wird immer wieder aufgerufen, wenn sich die Daten ändern

	// const - im Gegensatz zu let - ist eine Variablendefinition, die sich nicht ändern kann
	const currentDate = data.currentDate

	// diese Funktion wird aufgerufen, wenn auf den Button 'Zurück' oder 'Weiter' geklickt wird
	// sie gibt das Datum des vorherigen oder nächsten Monats zurück, abhängig vom i
	// i = -1 -> vorheriger Monat
	// i = +1 -> nächster Monat
	// siehe weiter unten die HTML Elemente, die auf diese Funktion verweisen

	const handleNextOrPrevMonth = (currentDate: Date, i: number) => {
		const newDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + i,
		);
		return `${newDate.getFullYear()}${(newDate.getMonth() + 1).toString().padStart(2, "0")
			}`;
	}

	// hier wird die Seite abschließend ausgegeben, dennoch kann man auch variablen
	// von oben weiterhin nutzen mit Hilfe von {variablenName}
	return (
		<>
			<Head>
				<title>Zeiterfassung</title>
			</Head>
			<div class="px-4 py-8 mx-auto bg-[#f0f0f0]">
				<div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
					<img
						class="my-6"
						src="/logo.svg"
						width="128"
						height="128"
						alt="the fresh logo: a sliced lemon dripping with juice"
					/>
					<h1 class="text-4xl font-bold mb-4">Zeiterfassung</h1>
					<div class="flex flex-col gap-8 py-6 items-center">
						<div class="flex gap-8 py-2 bg-gray-200 px-2 rounded-full items-center">
							<a
								href={`?ym=${handleNextOrPrevMonth(currentDate, -1)}`}
							>
								<button class="hover:font-bold min-w-[4rem] pointer text-center">
									Zurück
								</button>
							</a>
							<p class="text-lg font-medium min-w-[10rem] text-center items-center">
								{currentDate.toLocaleString("de-DE", {
									month: "long",
									year: "numeric",
								})}
							</p>
							<a
								href={`?ym=${handleNextOrPrevMonth(currentDate, +1)}`}
								class="hover:font-bold min-w-[4rem] pointer text-center"
							>
								<button class="hover:font-bold min-w-[4rem] pointer text-center">
									Weiter
								</button>
							</a>
						</div>
						{/* Dieser Abschnitt hat sehr viel Interaktivität (Javascript) */}
						{/* Datenbankzugriffe, Variablenänderungen, ... */}
						{/* Deshalb steckt er in einem eigenen Preact-Element */}
						{/* Hier werden die Datenbankdaten an das untergeordnete Element übergeben */}
						<Tabelle data={data} />
					</div>
				</div>
			</div>
		</>
	);
}
