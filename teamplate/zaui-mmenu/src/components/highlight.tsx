import React, { FC, useMemo } from 'react'

import { toLowerCaseNonAccentVietnamese } from '../utils/string'

const splitRegex = /[\d\w-(\u00C0-\u1EF9)]/

function useSplitWords(sentence: string) {
  return useMemo(() => {
    const tokens = sentence.trim().replace(/\s+/, ' ').split('')
    let word = ''
    const res: { word: string; isSpecial: boolean }[] = []
    while (tokens.length > 0) {
      if (!splitRegex.test(tokens[0])) {
        if (word.length) {
          res.push({ word, isSpecial: false })
          word = ''
        }
        res.push({ word: tokens.shift()!, isSpecial: true })
      } else {
        word += tokens.shift()!
      }
    }
    if (word.length) {
      res.push({ word, isSpecial: false })
    }
    return res
  }, [sentence])
}

export const Highlight: FC<{ keywords: string; content: string }> = ({ keywords, content }) => {
  const wordsInContent = useSplitWords(content)
  const wordsInKey = useSplitWords(keywords)
  const wordsToHighLight = useMemo(() => {
    return wordsInKey.filter((word) => !word.isSpecial).map((word) => toLowerCaseNonAccentVietnamese(word.word))
  }, [wordsInKey])

  return (
    <>
      {wordsInContent.map(({ word, isSpecial }) =>
        !isSpecial && wordsToHighLight.includes(toLowerCaseNonAccentVietnamese(word)) ? (
          <mark className="bg-transparent font-medium">{word}</mark>
        ) : (
          word
        ),
      )}
    </>
  )
}
