const os = require("os");
var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
var pty = require('node-pty');


const currentActiveProcess = {}

const terminalHandler = async (io, socket) => {

	let ptyProcess;

	socket.on('create-terminal', async () => {
		if (ptyProcess) return;
		ptyProcess = pty.spawn(shell, [], {
			name: 'xterm-color',
			cols: 80,
			rows: 30,
			cwd: process.env.HOME,
			env: process.env
		});

		currentActiveProcess[ptyProcess.pid] = ptyProcess
		ptyProcess.onData(function (data) {
			socket.emit('terminal-data', data)
		});


		ptyProcess.onExit(e => {
			ptyProcess?.pid && delete currentActiveProcess[ptyProcess.pid]
			ptyProcess = null
			socket.emit('terminal-exit', e)
		})

	})

	socket.on('command', (data) => {
		ptyProcess.write(`${data}`);
	})

	socket.on('close-terminal', data => {
		if (!ptyProcess) return
		delete currentActiveProcess[ptyProcess.pid];
		ptyProcess.kill();
		ptyProcess = null;
	})

	socket.on('disconnect', () => {
		if (!ptyProcess) return;
		console.log('disconnected', socket.id)
		delete currentActiveProcess[ptyProcess.pid];
		ptyProcess.kill();
	})

}

module.exports = { terminalHandler, currentActiveProcess }