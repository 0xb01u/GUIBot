let fs = require("fs");

class Encuesta {
	// Crear el objeto encuesta:
	constructor(nombre, opciones, servidor, canal) {
		if (opciones.length < 2) throw "cantidad de opciones insuficiente.";
		this.nombre = nombre;		// Nombre/título de la encuesta.
		this.opciones = opciones;	// Lista de opciones a votar (se pasa como argumento).
		this.votos = [];			// Lista de votos para cada opción.

		/* votos es una lista de lista. Tiene tantas listas como opciones tiene la encuesta.
		 * Cada lista en votos guarda los usuarios que han votado a esa opción. */

		// Creamos una lista en votos por cada opción de la encuesta:
		for (const e in options)
			this.votos.push([]);	// .push(e) mete el elemento e al principio de una lista.

		// Servidor al que pertenece la encuesta:
		this.servidor = servidor;
		// Canal al que pertenece la encuesta:
		this.canal = canal;

		// Guardar la encuesta:
		this.save();
	}

	// Añadir un voto a una opción para un usuario dado.
	vote(opcion, usuario) {
		if (opcion > this.opciones.length || opcion < 1) throw "opción inválida.";

		// Eliminar el anterior voto del usuario, si hubiese:
		// Primero recorremos los votos de todas las opciones.
		let (i = 0; i < this.votos.length; i++) {
			let opcionActual = this.votos[i];

			// Comprobar si los votos de la opción actual incluyen al usuario buscado.
			if (opcionActual.includes(usuario))
				if (opcionActual.length > 1)
					this.votos.splice(this.votos.indexOf(usuario), 1);
					// .splice(i, n) elimina n elementos de una lista a partir del elemento número i.

				// En el caso de que la opción solo tuviera 1 voto, hay que cambiar la lista por
				// la lista vacía para evitar ciertos problemas de javascript.
				else
					this.votos[opcionActual] = [];
		}

		// Añadir el usuario a los votos de la opción correspondiente:
		this.votos[opcion - 1].push(usuario);	// .push(e) mete el elemento e al principio de una lista.

		// Guardar la encuesta:
		this.save();
	}

	// Contar el número total de votos en la encuesta.
	getTotalvotos() {
		// Utilizamos una función reduce junto con una lambda que
		// devuelven la suma de todas las lengths de las listas en votos.
		return this.votos.reduce((a, b) => a.length + b.length);
	}

	// Guardar la encuesta.
	save() {
		// Guardamos la encuesta en una carpeta con el servidor por nombre:
		let dir = `./encuestas/${this.servidor}`;
		//Creamos la carpeta si no existe:
		if (!fs.existsSync(dir)) fs.mkdirSync(dir);

		// La encuesta se guarda con el nombre del canal:
		fs.writeFile(`${dir}/${this.canal}.json`,
			JSON.stringify(this),				// String JSON del objeto.
			err => { if (err) throw err; });	// Función que se ejecuta si hay algún error al guardar.
	}

	// Cargar una encuesta a partir de un fichero JSON:
	static fromJSON(json) {
		// Creamos un objeto encuesta "por defecto" temporal:
		let enc = new Encuesta("", [0, 0], ".temp", ".temp");

		// Le asignamos el objeto JSON:
		// (Es decir, le pasamos los atributos del objeto JSON.)
		Object.assign(enc, json);
		return enc;
	}
};

module.exports = Encuesta;
