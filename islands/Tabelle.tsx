// interface ist ein Datentyp, der nur zur Typisierung verwendet wird
// und nicht in JavaScript übersetzt wird, kann also eigentlich weggelassen werden
// aber so ist es übersichtlicher und zeigt Fehler direkt im Code an

interface TimeTracking {
	// [day: number] bedeutet, dass die Keys des Dictionaries unter overtime
	// vom Typ number sind und die Values vom Typ number sind, also
	// overtime = { 1: 0, 2: 0, 3: 0, ... } etc.
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

interface TimetrackingProps {
	data: {
		// ym ist das aktuelle Jahr und Monat, z.B. 202108 / 2021-08
		// ym ist der key, der Wert ist vom Typ string
		ym: string;
		currentDate: Date;
		tracking: TimeTracking;
	}
}

// Preact-Komponente, die die Tabelle mit den Zeiteinträgen rendert
export default function Counter(props: TimetrackingProps) {
	// rows ist ein Array, das die einzelnen Zeilen der Tabelle enthält
	const rows = [];

	// currentDate ist das aktuelle Datum der Seite von der Tabelle
	const currentDate = new Date(props.data.currentDate);
	const daysInMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0,
	).getDate();

	// props sind die Daten, die von der übergeordneten Komponente übergeben werden
	// sie werden über <Tabelle data={...} /> übergeben, siehe index.tsx
	// hier sind das die Daten aus der Datenbank
	const timetracking = props.data.tracking;

	// Funktion, die aufgerufen wird, wenn sich ein Wert in der Tabelle ändert
	// - sie lädt die Daten in die Datenbank hoch und aktualisiert die Daten in der Tabelle
	// - value ist der neue Wert, i ist der Tag, category ist die Kategorie (Arbeitszeit, Pause, Überstunden)
	// - die Funktion ist async, weil sie auf die Antwort des Servers warten muss
	// - d ist die Antwort des Servers, die in der Konsole ausgegeben wird
	// - die Funktion gibt nichts zurück, deshalb ist der Rückgabetyp void (bzw. am Ende ist kein return)
	const updateTimeTracking = async (value: number, i: number, category: keyof TimeTracking) => {
		props.data.tracking[category][i] = value;
		console.log(value, i, category);
		const uploadData = {
			ym: props.data.ym,
			value: value,
			day: i,
			category: category
		}
		// fetch ist eine Funktion, die Daten vom Server lädt, im Folgenden über die URL routes/api/upload.ts
		// - die Daten werden als JSON dictionary übertragen im body tag des POST requests im fetch
		// - JSON.stringify() ist notwendig, da nur Strings übertragen werden können
		// - Die Daten werden in der Datei routes/api/upload.ts (const params = await _req.json();)
		//   durch _req.json() wieder in ein JSON dictionary umgewandelt
		// - die Antwort des Servers wird in der Variable response gespeichert (JSON string)
		// - die Antwort des servers (result) wird in ein JSON dictionary umgewandelt (d) durch .json()
		const response = fetch(`/api/db-upload-data`, { method: 'POST', body: JSON.stringify(uploadData) } );
		const result = await response;
		const d = await result.json();
		console.log(d);

		// wenn hier return d stehen würde, könnte man die Funktion wo anders so nutzen:
		// "const result = await updateTimeTracking(...)", weiter unten z.B.
	};


	// Schleife, die die einzelnen Zeilen der Tabelle rendert
	for (let i = 1; i <= daysInMonth; i++) {
		// date ist das aktuelle Datum der Tabelle
		const date = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			i,
		);
		// isWeekend ist true, wenn das aktuelle Datum ein Wochenende ist, damit die Zeile farblich hervorgehoben werden kann
		const isWeekend = date.getDay() === 0 || date.getDay() === 6;
		// inputId ist die ID des Eingabefeldes, damit das Eingabefeld mit dem Label verknüpft werden kann
		// und damit das Eingabefeld einzigartig ist
		const inputId = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")
			}-${i.toString().padStart(2, "0")}`;

		// push fügt ein Element am Ende des Arrays hinzu
		rows.push(
			<tr key={i}>
				<td class={`border p-2 ${isWeekend ? "bg-yellow-100" : ""}`}>
					{i}
				</td>
				{/* Die folgendende Spalte wird auf kleinen Bildschirmen ausgeblendet */}
				<td
					class={`border p-2 hidden md:block ${isWeekend ? "bg-yellow-100" : ""
						}`}
				>
					{date.toLocaleString("de-DE", { weekday: "long" })}
				</td>
				<td class={`border p-2 ${isWeekend ? "bg-yellow-100" : ""}`}>
					<input
						type="text"
						pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
						key={`${inputId}`}
						class="bg-transparent w-16 text-center text-black font-bold outline-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
						value={timetracking.workingtime[i] ?? undefined}
						onBlur={(event) => updateTimeTracking(Number((event.target as HTMLInputElement).value), i, "workingtime")}
					/>
				</td>
				<td class={`border p-2 ${isWeekend ? "bg-yellow-100" : ""}`}>
					<select
						class="bg-transparent"
						onChange={(event) =>
							updateTimeTracking(Number((event.target as HTMLSelectElement).value), i, "pause")}
					>
						{Array.from({ length: 18 }, (_, i) => i * 5).map((value) => (
							<option
								key={`${inputId}-${value}`}
								value={value}
								selected={Number(`${value}`) ===
									timetracking.pause[i]}
							>
								{value} min
							</option>
						))}
					</select>
				</td>
				<td class={`border p-2 ${isWeekend ? "bg-yellow-100" : ""}`}>
					<select
						class="bg-transparent"
						onChange={(event) =>
							updateTimeTracking(Number((event.target as HTMLSelectElement).value), i, "overtime")}
					>
						{Array.from({ length: 60 }, (_, i) => i * 5).map((value) => (
							<option
								key={`${inputId}-${value}`}
								value={value}
								selected={Number(`${value}`) ===
									timetracking.overtime[i]}
							>
								{value} min
							</option>
						))}
					</select>
				</td>
			</tr>
		);
	}
	return <div>
		<table class="table-auto">
			<thead>
				<tr>
					<th class="p-2">Tag</th>
					{/* Die folgendende Spalte wird auf kleinen Bildschirmen ausgeblendet */}
					<th class="p-2 hidden md:block">Wochentag</th>
					<th class="p-2">Arbeitszeit</th>
					<th class="p-2">Pause</th>
					{/* Die folgendende Spalte wird auf kleinen Bildschirmen geschrumpft */}
					<th class="p-2">
						<span class="hidden md:block">Überstunden</span>
						<span class="md:hidden">+</span>
					</th>
				</tr>
			</thead><tbody>{rows}</tbody></table>
	</div>
}
