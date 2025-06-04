import { readdirSync } from "fs"
import { join } from "path"
import { questionInt } from "readline-sync"
import { pathToFileURL } from "url"

async function main() {
  const snippets = join(__dirname, "../src/snippets")
  const files = readdirSync(snippets).filter((f) => f.endsWith(".ts"))
  
  if (files.length === 0) {
    console.log("No snippets found")
    return
  }

  console.log("Available snippets:")
  files.forEach((file, idx) => {
    console.log(`${idx + 1}.) ${file}`)
  })

  
  let idx = questionInt("Select a snippet to run (number): ")

  if (isNaN(idx) || idx < 1 || idx > files.length) {
    console.log("Invalid selection")
    return
  }

  const snippetPath = join(snippets, files[idx - 1])
  const snippetUrl = pathToFileURL(snippetPath).href
  await import(snippetUrl)
} 

main()
