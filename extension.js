const vscode = require("vscode");
const { LanguageClient, TransportKind } = require("vscode-languageclient/node");

let client;

function activate(context) {
	if (client) return;

	const config = vscode.workspace.getConfiguration("rpm-spec-lsp");
	const command = config.get("path") || "rpm-spec-lsp";

	const serverOptions = {
		command,
		args: ["--stdio"],
		transport: TransportKind.stdio,
	};

	const clientOptions = {
		documentSelector: [
			{ scheme: "file", language: "spec" },
			{ scheme: "untitled", language: "spec" },
		],
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher("**/*.spec"),
		},
		initializationOptions: {
			workspaceFolders:
				vscode.workspace.workspaceFolders?.map((f) => f.uri.fsPath) ?? [],
		},
		outputChannelName: "RPM SPEC LSP",
	};

	client = new LanguageClient(
		"rpmSpecLspClient",
		"RPM SPEC Language Client",
		serverOptions,
		clientOptions,
	);

	context.subscriptions.push(client);
	client.start();
}

function deactivate() {
	if (!client) return;
	return client.stop();
}

module.exports = { activate, deactivate };
