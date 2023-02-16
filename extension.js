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
	"a": "ₐ",
	"e": "ₑ",
	"o": "ₒ",
	"x": "ₓ",
	"y": "ᵧ",
	"z": "\u1DBB"
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


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "notesnarf" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('notesnarf.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from NoteSnarf!');
	});

	let disposable2 = vscode.commands.registerCommand('notesnarf.replaceSymbols', function () {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}
		let document = editor.document;
		const original_text = document.getText();
		let word_array = original_text.split(" ");

		for (let i in word_array) {
			if (word_array[i].includes('\\') === false) {
				continue;
			}
			else if (word_array[i].includes('{') && word_array[i].includes('}')) {
				let [command, args] = extract_bracketed_arguments(word_array[i]);
				if (command.toString() in symbol_map_args) {
					let new_word = symbol_map_args[command];
					word_array[i] = word_array[i].split("\\")[0] + new_word(args);
				}
			}
			else if (word_array[i] in symbol_map) {
				word_array[i] = symbol_map[word_array[i]];
			}
		}
		let rebuilt_text = word_array.join(" ");
		if (rebuilt_text === original_text) {
			vscode.window.showInformationMessage('No changes made');
			return;
		}
		else {
			editor.edit(editBuilder => {
				editBuilder.replace(new vscode.Range(0, 0, document.lineCount, 0), rebuilt_text);
			});
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
function deactivate() { }

function extract_bracketed_arguments(text) {
	let args = [];
	let command = "\\" + text.split("\\")[1].split('{')[0];
	for (let i = 1; i < text.length; i++) {
		if (text[i] == '{') {
			let bracket_count = 1;
			let arg = "";
			while (bracket_count > 0) {
				i++;
				if (text[i] != '}') {
					arg += text[i];
				}
				if (text[i] == '{') {
					bracket_count++;
				}
				else if (text[i] == '}') {
					bracket_count--;
				}

			}
			args.push(arg);
		}
	}
	return [command, args];

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



module.exports = {
	activate,
	deactivate
}
