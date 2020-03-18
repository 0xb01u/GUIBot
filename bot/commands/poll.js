const Discord = require("discord.js");
const Encuesta = require("../modules/encuesta.js");

const fs = require("fs");

exports.run = async(bot, msg, args) => {
	// Notificar si no se han introducido argumentos para el comando:
	if (!args[0]) return msg.reply("uso incorrecto: faltan argumentos!");

	// Reemplazar  todas las barras bajas por espacios:
	for (let i = 0; i < args.length; i++)
		args[i] = args[i].replace(/_/g, " ");
		// Utilizamos .replace() y una expresión regular para el reemplazo.

	// Creamos la carpeta para las encuestas si no existe:
	if (!fs.existsSync("./encuestas")) fs.mkdirSync("./encuestas");

	let poll = {};	// Objeto encuesta temporal.
	// Identificamos el servidor con su nombre y su ID de Discord:
	let servidor = `${msg.channel.guild.name}#${msg.channel.guild.id}`;
	// Identificador del canal con su nombre.
	let canal = `${msg.channel.name}`;
	let rutaEncuestas = `../encuestas/${servidor}/`;
	let json = {}	// Fichero JSON temporal del que cargar encuestas.

	// Función que se repite para cargar una encuesta:
	cargarEncuesta = () => {
		// Determinar el json de la encuesta para el canal:
		json = `${rutaEncuestas}/${canal}.json`;
		delete require.cache[require.resolve(json)];	// Recargar la encuesta.

		// Cargar la encuesta:
		poll = Encuesta.fromJSON(json);
	}

	try {

		// Acción en función el primer argumento:
		switch (args[0]) {
			case "view":
				// Simplemente hay que cargar la encuesta correspondiente;
				// el mensaje con la encuesta se enviará luego.
				cargarEncuesta();
				break;

			case "vote":
				// Comprobar que se ha introducido el número de la opción:
				if (isNaN(parseInt(args[1])))
					throw "número de encuesta incorrecto."

				cargarEncuesta();
				// Realizar el voto a la opción indicada, a partir del nombre del usuario.
				// (En vez del nombre se podría enviar el objeto usuario o su ID de Discord.)
				poll.vote(args[1], msg.member.displayName);
				break;
			default:
				// Crear una encuesta:
				if (args.length < 2)
					throw "cantidad de opciones incorrecta."

				let opciones = args.slice(1, args.length);
				// .slice(i, f) crea una sublista con los elementos desde el i hasta el f.

				poll = new Poll(args[0], opciones, servidor, canal);
				break;
		}		

	} catch(e) { msg.reply(`Error al ejecutar el comando: ${e}`); }

	enviarEncuesta(poll, msg);
};

// Enviar encuesta como un RichEmbed:
async function sendPoll(poll, msg) {
	const embed = new Discord.RichEmbed()
		.setColor(0xffffff)			// Color del embed: blanco.
		.setTitle(`(${poll.name}`);	// Nombre de la encuesta.

	// Añadir campos por cada opción de la encuesta:
	for (let i = 0; i < poll.opciones.length; i++)
		embed.addField(`${(i + 1)}.- ${poll.opciones[i]}`, `${poll.votos[i].length}`
			// Porcentaje de votos para la opción:
			+ ` (${parseInt((poll.votos[i].length / (poll.getvotos() ? poll.getvotos() : 1))*100)}%)`);

	// Enviar la encuesta al canal al que se envió el mensaje:
	let channel = msg.channel;
	let reply = await channel.send(embed);
}
