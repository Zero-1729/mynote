const parse = text => require('./../downmoji').parse(text, 'build/emojis/pngs', [' ', ';', ',', '.'], {'^': 'sup', '~': 'sub'}, true)

var text_input = ''

text_input = 'hello :smiley:, I am soo :cool_guy. So :sunny:'

console.log("==============================")
console.log("[Test 1] Inline Broken emoji")
console.log("==============================")
console.log(`[Input 1] ${text_input}`)
console.log("========================================================")

parse(text_input)

text_input = 'hello :shipit: :shipit:'
console.log("\n=================================")
console.log("[Test 2] Inline successive emojis")
console.log("=================================")
console.log(`[Input 2] ${text_input}`)
console.log("=================================")
parse(text_input)

text_input = 'help me parse :laughing: :laughing:'
console.log("\n=================================")
console.log("[Test 3] Inline odd emojis?")
console.log("==================================")
console.log(`[Input 3] ${text_input}`)
console.log("==============================================")
parse(text_input)

text_input = ":dromedary_camel: :dromedary_camel:"
console.log("\n=================================")
console.log("[Test 4] Inline underscored")
console.log("==================================")
console.log(`[Input 4] ${text_input}`)
console.log("==============================================")
parse(text_input)

text_input = "We should see this Parser^[1]^ as a stepping... it may as well be Log~10~(2)"
console.log("\n=================================")
console.log("[Test 5] Special Symbols")
console.log("=================================")
console.log(`[Input 5] ${text_input}`)
console.log("==================================")
parse(text_input)
