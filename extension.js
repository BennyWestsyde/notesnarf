// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const symbol_map = {
	"\\not": "¬",
	"\\and": "∧",
	"\\or": "∨",
	"\\implies": "→",
	"\\iff": "↔",
	"\\in": "∈",
	"\\notin": "∉",
	"\\ni": "∋",
	"\\subset": "⊂",
	"\\supset": "⊃",
	"\\subseteq": "⊆",
	"\\supseteq": "⊇",
	"\\emptyset": "∅",
	"\\infty": "∞",
	"\\partial": "∂",
	"\\parallel": "∥",
	"\\perp": "⊥",
	"\\models": "⊧",
	"\\notmodels": "⊭",
	"\\geq": "≥",
	"\\leq": "≤",
	"\\neq": "≠",
	"\\approx": "≈",
	"\\equiv": "≡",
	"\\pm": "±",
	"\\concat": "⋅",
	"\\times": "×",
	"\\lambda": "λ",
	"\\mu": "μ",
	"\\pi": "π",
	"\\theta": "θ",
	"\\alpha": "α",
	"\\beta": "β",
	"\\gamma": "γ",
	"\\delta": "δ",
	"\\epsilon": "ε",
	"\\zeta": "ζ",
	"\\eta": "η",
	"\\iota": "ι",
	"\\kappa": "κ",
	"\\dot": "⋅",
}

// Add more mappings for subscript, superscript, mathbb_map, and symbol_map_args as needed...

// Recursive function to replace LaTeX commands
function replaceLatex(text) {
	let pattern = /(\\[a-z]+)(\{[^{}]*\})?/gi;
	let newText = text.replace(pattern, function (match, command, args) {
		// If arguments are present, remove braces and recursively replace any nested commands
		if (args) {
			args = args.slice(1, -1);
			args = replaceLatex(args);
			args = args.split(",");
		}

		// Replace command with symbol or function result
		if (command in symbol_map) {
			return symbol_map[command];
		} else if (command in symbol_map_args) {
			return symbol_map_args[command](args);
		} else {
			return match; // Return original match if command is not recognized
		}
	});

	return newText;
}

// Function to replace symbols in the current document
function replaceSymbols() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; // No open text editor
	}

	let document = editor.document;
	let original_text = document.getText();

	let rebuilt_text = replaceLatex(original_text);

	if (rebuilt_text === original_text) {
		vscode.window.showInformationMessage('No changes made');
		return;
	} else {
		editor.edit(editBuilder => {
			editBuilder.replace(new vscode.Range(0, 0, document.lineCount, 0), rebuilt_text);
		});
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
	console.log('Congratulations, your extension "notesnarf" is now active!');

	let disposable = vscode.commands.registerCommand('notesnarf.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from NoteSnarf!');
	});

	let disposable2 = vscode.commands.registerCommand('notesnarf.replaceSymbols', replaceSymbols);

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
	// Register a completion item provider for all languages
	let provider = vscode.languages.registerCompletionItemProvider('*', {
		provideCompletionItems(document, position, token, context) {
			// Get all text until the `position` and check if it ends in '\'
			let linePrefix = document.lineAt(position).text.substr(0, position.character);
			if (!linePrefix.startsWith('\\')) {
				return undefined;
			}

			// Create completion items for each LaTeX command in symbol_map and symbol_map_args
			let completions = [];
			for (let command in symbol_map) {
				let item = new vscode.CompletionItem(command, vscode.CompletionItemKind.Snippet);
				item.insertText = command.slice(1);  // Remove leading backslash
				completions.push(item);
			}
			for (let command in symbol_map_args) {
				let item = new vscode.CompletionItem(command, vscode.CompletionItemKind.Snippet);
				item.insertText = command.slice(1);  // Remove leading backslash
				completions.push(item);
			}

			return completions;
		}
	}, '\\');

	context.subscriptions.push(provider);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}


const superscript_map = {
	"0": "⁰",
	"1": "¹",
	"2": "²",
	"3": "³",
	"4": "⁴",
	"5": "⁵",
	"6": "⁶",
	"7": "⁷",
	"8": "⁸",
	"9": "⁹",
	"+": "⁺",
	"-": "⁻",
	"=": "⁼",
	"(": "⁽",
	")": "⁾",
	"a": "ᵃ",
	"b": "ᵇ",
	"c": "ᶜ",
	"d": "ᵈ",
	"e": "ᵉ",
	"f": "ᶠ",
	"g": "ᵍ",
	"h": "ʰ",
	"i": "ⁱ",
	"j": "ʲ",
	"k": "ᵏ",
	"l": "ˡ",
	"m": "ᵐ",
	"n": "ⁿ",
	"o": "ᵒ",
	"p": "ᵖ",
	"r": "ʳ",
	"s": "ˢ",
	"t": "ᵗ",
	"u": "ᵘ",
	"v": "ᵛ",
	"w": "ʷ",
	"x": "ˣ",
	"y": "ʸ",
	"z": "ᶻ",
	"A": "ᴬ",
	"B": "ᴮ",
	"C": "ᶜ",
	"D": "ᴰ",
	"E": "ᴱ",
	"F": "ᶠ",
	"G": "ᴳ",
	"H": "ᴴ",
	"I": "ᴵ",
	"J": "ᴶ",
	"K": "ᴷ",
	"L": "ᴸ",
	"M": "ᴹ",
	"N": "ᴺ",
	"O": "ᴼ",
	"P": "ᴾ",
	"Q": "Q",
	"R": "ᴿ",
	"S": "ˢ",
	"T": "ᵀ",
	"U": "ᵁ",
	"V": "ⱽ",
	"W": "ᵂ",
	"X": "ˣ",
	"Y": "ʸ",
	"Z": "ᶻ",
}

const subscript_map = {
	"0": "₀",
	"1": "₁",
	"2": "₂",
	"3": "₃",
	"4": "₄",
	"5": "₅",
	"6": "₆",
	"7": "₇",
	"8": "₈",
	"9": "₉",
	"+": "₊",
	"-": "₋",
	"=": "₌",
	"(": "₍",
	")": "₎",
}

const mathbb_map = {
	"R": "ℝ",
	"Z": "ℤ",
	"Q": "ℚ",
	"C": "ℂ",
	"N": "ℕ",
	"P": "ℙ",
	"H": "ℍ",
}

const symbol_map_args = {
	"\\frac": build_frac,
	"\\sqrt": build_sqrt,
	"\\vec": build_vec,
	"\\forall": build_forall,
	"\\exists": build_exists,
	"\\nexists": build_nexists,
	"\\mathbb": build_mathbb,
}


function build_frac(args) {
	let [arg1, arg2] = args;
	return superscript_map[arg1] + "\u2044" + subscript_map[arg2];
}

function build_sqrt(args) {
	let [arg1] = args;
	let result = "√";
	for (let k in arg1) {
		result += arg1[k] + "\u0305";
	}
	return result;
}

function build_vec(args) {
	let [arg1] = args;
	let result = "";
	for (let k in arg1) {
		result += arg1[k] + "\u20D7";
	}
	return result;
}

function build_forall(args) {
	let [arg1] = args;
	let result = "∀";
	for (let k in arg1) {
		result += subscript_map[arg1[k]];
	}
	return result;
}

function build_exists(args) {
	let [arg1] = args;
	let result = "∃";
	for (let k in arg1) {
		result += subscript_map[arg1[k]];
	}
	return result;
}

function build_nexists(args) {
	let [arg1] = args;
	let result = "∄";
	for (let k in arg1) {
		result += subscript_map[arg1[k]];
	}
	return result;
}

function build_mathbb(args) {
	let [arg1] = args;
	let result = "";
	for (let k in arg1) {
		result += mathbb_map[arg1[k]];
	}
	return result;
}

