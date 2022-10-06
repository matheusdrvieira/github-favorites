import { GithubUser } from "./githubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []

        if (this.entries.length) {
            addHide()
        } else {
            removeHide()
        }

        return this.entries
    }

    save() {
        localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if (userExists) {
                throw new Error("Usuário já cadastrado")
            }

            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error("Usuário não encontrado")
            }

            this.entries = [user, ...this.entries]

            this.save()
            this.update()


        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry =>
            entry.login !== user.login)

        this.entries = filteredEntries

        this.save()
        this.update()

    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector("table tbody")

        this.update()
        this.onadd()


    }

    onadd() {
        const addButton = this.root.querySelector("header button")
        addButton.onclick = () => {
            const { value } = this.root.querySelector("header input")

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.load().forEach(user => {
            const row = this.createRow()

            row.querySelector(".user img").src = `https://github.com/${user.login}.png`
            row.querySelector(".user img").alt = `image de ${user.name}`
            row.querySelector(".user a").href = `https://github.com/${user.login}`
            row.querySelector(".user p").textContent = user.name
            row.querySelector(".user span").textContent = user.login
            row.querySelector(".repositories").textContent = user.public_repos
            row.querySelector(".followers").textContent = user.followers
            row.querySelector(".remove").onclick = () => {
                const isOk = confirm("Tem certeza que deseja deletar?")

                if (isOk) {
                    this.delete(user)
                }
            }
            this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement("tr")
        tr.innerHTML =
            `<td class="user">
            <img src="https://github.com/MatheusVieira14.png" alt="">
            <a href="https://github.com/MatheusVieira14" target="_blank">
            <p>Matheus Vieira</p>
            <span>/MaTheusVieira14</span>
        </td>
        <td class="repositories">
            13
        </td>
        <td class="followers">
            2
        </td>
        <td>
            <button class="remove">&times; Remover</button>
        </td> `

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll("tr").forEach((tr) => {
            tr.remove()
        })
    }
}

const emptyScreen = document.querySelector("main")

function removeHide() {
    emptyScreen.classList.remove("hide")
}

function addHide() {
    emptyScreen.classList.add("hide")
}