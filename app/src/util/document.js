// To provide a shorter name for certain document functions

const QuerySelectorAll = (name, parentElement) => {
    return parentElement.querySelectorAll(name)
}

const ClassName = (name) => {
    return document.getElementsByClassName(name)
}

const ClassNameSingle = (name) => {
    return document.getElementsByClassName(name)[0]
}

const ClassNameN = (name, index) => {
    return document.getElementsByClassName(name)[index]
}

const TagName = (type) => {
    return document.getElementsByTagName(type)
}

const TagNameN = (type, index) => {
    return document.getElementsByTagName(type)[index]
}

const Id = (name) => {
    return document.getElementById(name)
}

const CreateElement = (type) => {
    return document.createElement(type)
}

module.exports = { ClassName, ClassNameSingle, ClassNameN, TagName, TagNameN, Id, QuerySelectorAll, CreateElement }
