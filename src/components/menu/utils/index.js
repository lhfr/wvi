export const updataOpenedNames = (openedNames, name) => {
	openedNames.includes(name) ? openedNames.splice(openedNames.indexOf(name), 1) : (openedNames.push(name) && openedNames.sort())
	return openedNames
}