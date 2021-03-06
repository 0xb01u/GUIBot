const Discord = require("discord.js");	// Importar discord.js en una constante.
require("dotenv").config();				// Inicializar las variables de entorno.

const bot = new Discord.Client();		// Creación del (objeto) bot.
bot.login(process.env.TOKEN);			// Login del bot en Discord.

// Mensaje de inicio (por consola):
// El primer parámetro es el evento que tiene que ocurrir ("ready").
// El segundo parámetro es la función a ejecutar cuando ocurra el evento.
bot.on("ready", () => {
	console.log("Hola Discord!");
})´;

// Prueba de que el bot funciona:
// bot.on("message", msg => msg.reply("Hola!"));

// Tratamiento de mensajes:
bot.on("message", msg => {
	// IMPORTANTE: no interactuar con bots.
	if (msg.author.bot) return;
	// Comprobar que el mensaje tiene el prefijo de comando:
	if (!msg.content.startsWith(process.env.PREFIX)) return;
	// Comprobar que el autor tiene el rol mínimo para utilizar comandos:
	if (!msg.member.roles.find(r => r.name === process.env.ROL)) return;

	// Separación de mensaje y argumentos:
	let args = msg.content						// Contenido (texto) del mensaje.
		.substring(process.env.PREFIX.length)	// Quitamos el prefijo.
		.split(" ");							// Separamos cada palabra por espacios.

	// Comando:
	let cmd = args.shift()	// Shift devuelve elimina de args la primera palabra y la devuelve.
		.toLowerCase();		// Pasamos la palabra a minúsculas, por si acaso.

	// Ejecución del script asociado al comando:
	try {

		// Actualizar el fichero del script, por si acaso está obsoleto:
		delete require.cache[require.resolve(`./commands/${cmd}.js`)];
		// Cargar el script correspondeinte al comando:
		let cmdScript = require(`./commands/${cmd}.js`);
		cmdScript.run(bot, msg, args);

	} catch (e) { console.log(e.stack); }
});