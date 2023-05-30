export const firstLetterInUpperCase = (word) => {
    let wordlowerCase = word.toLowerCase()
    const capitalized =
    wordlowerCase.charAt(0).toUpperCase()
        + wordlowerCase.slice(1)

    return capitalized
}