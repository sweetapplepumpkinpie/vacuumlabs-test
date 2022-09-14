const fs = require('fs')

const { T: testCase, testCases: testData } = require('./challenge.json')

const bfs = function (word, all_pairs, visited) {
  const synonym = []
  const current_group = []
  let i, pair
  let length_all_pairs = all_pairs.length
  synonym.push(word)
  while (synonym.length > 0) {
    word = synonym.shift()
    if (!visited[word]) {
      visited[word] = true
      current_group.push(word)

      for (i = 0; i < length_all_pairs; i += 1) {
        pair = all_pairs[i]
        if (
          pair[0].toLocaleLowerCase() === word &&
          !visited[pair[1].toLocaleLowerCase()]
        ) {
          synonym.push(pair[1].toLocaleLowerCase())
        } else if (
          pair[1].toLocaleLowerCase() === word &&
          !visited[pair[0].toLocaleLowerCase()]
        ) {
          synonym.push(pair[0].toLocaleLowerCase())
        }
      }
    }
  }
  return current_group
}

const result = []

for (let testNumber = 0; testNumber < testCase; testNumber++) {
  const dictionary = testData[testNumber].dictionary

  const synonyms = []
  let i, length, firstWord, secondWord, source, current_pair
  let visited = {}

  for (i = 0, length = dictionary.length; i < length; i += 1) {
    current_pair = dictionary[i]
    firstWord = current_pair[0].toLocaleLowerCase()
    secondWord = current_pair[1].toLocaleLowerCase()
    source = null
    if (!visited[firstWord]) {
      source = firstWord
    } else if (!visited[secondWord]) {
      source = secondWord
    }
    if (source) {
      synonyms.push(bfs(source, dictionary, visited))
    }
  }

  const wordMap = new Map()
  for (let i = 0; i < synonyms.length; i++) {
    for (let j = 0; j < synonyms[i].length; j++) {
      wordMap[synonyms[i][j]] = i + 1
    }
  }

  const queries = testData[testNumber].queries

  for (let i = 0; i < queries.length; i++) {
    if (
      (wordMap[queries[i][0].toLocaleLowerCase()] &&
        wordMap[queries[i][1].toLocaleLowerCase()] &&
        wordMap[queries[i][0].toLocaleLowerCase()] ===
          wordMap[queries[i][1].toLocaleLowerCase()]) ||
      queries[i][0].toLocaleLowerCase() === queries[i][1].toLocaleLowerCase()
    ) {
      result.push('synonyms')
    } else {
      result.push('different')
    }
  }
}

fs.writeFile('output.json', JSON.stringify({ result }), function (err, result) {
  if (err) console.log('error', err)
})
