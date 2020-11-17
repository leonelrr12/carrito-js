document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        pintarProductos(data)
        detectarBotones(data)
    } catch (error) {
        console.log(error)
    }
}

const listProductos = document.getElementById('listProductos')
const pintarProductos = (data) => {
    const template = document.getElementById('template').content
    const fragment = document.createDocumentFragment()

    data.forEach(producto => {
        template.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        template.querySelector('h5').textContent = producto.title
        template.querySelector('p span').textContent = producto.precio
        template.querySelector('button').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    listProductos.appendChild(fragment)
}


let carrito = {}
const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = data.find(item => item.id === parseInt(btn.dataset.id))

            if(carrito.hasOwnProperty(producto.id)) {
                producto.cantidad ++
            } else {
                producto.cantidad = 1
            }

            carrito[producto.id] = { ...producto }
            pintarCarrito()
        })
    })
}

const items = document.getElementById('items')
const pintarCarrito = () => {

    const templateTable = document.getElementById('templateTable').content
    const fragment = document.createDocumentFragment()
    items.innerHTML = ""

    Object.values(carrito).forEach(producto => {
        templateTable.querySelector('th').textContent = producto.id
        templateTable.querySelectorAll('td')[0].textContent = producto.title
        templateTable.querySelectorAll('td')[1].textContent = producto.cantidad

        // Version original
        // templateTable.querySelectorAll('td')[2].innerHTML = `
        //     <button id="mas-${producto.id}" class="btn btn-info btn-sm" data-id=${producto.id}>+</button>
        //     <button id="men-${producto.id}" class="btn btn-danger btn-sm" data-id=${producto.id}>-</button>
        // `

        // Mejorado
        templateTable.querySelector('.btn-info').dataset.id = producto.id
        templateTable.querySelector('.btn-danger').dataset.id = producto.id

        const wtotal = producto.cantidad * producto.precio
        templateTable.querySelector('span').textContent = wtotal

        const clone = templateTable.cloneNode(true)
        fragment.appendChild(clone)
    })
    
    items.appendChild(fragment)
    pintarFooter()
    // btnesAccion()
    accionBotones()
}


const footer = document.getElementById('footer-carrito')

const pintarFooter = () => {
    const templateTFoot = document.getElementById('templateTFoot').content
    const fragment = document.createDocumentFragment()

    footer.innerHTML = ''

    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }
    
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nTotal = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + (cantidad * precio), 0)

    templateTFoot.querySelectorAll('td')[0].textContent = nCantidad
    templateTFoot.querySelector('span').textContent = nTotal
    const clone = templateTFoot.cloneNode(true)

    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const vaciarCarrito = document.getElementById('vaciar-carrito')

    vaciarCarrito.addEventListener('click', (e) => {
        e.preventDefault();
    
        carrito = {}
        pintarCarrito()
    })    
}


// const btnesAccion = () => {
//     const botones = document.querySelectorAll('tbody button')
//     botones.forEach(btn => {
//         btn.addEventListener('click', () => {
//             const id = btn.dataset.id

//             if(btn.innerHTML=="+"){
//                 carrito[id].cantidad ++
//             } else {
//                 carrito[id].cantidad --
//             }
            
//         })
//     })
// }


const accionBotones = () => {

    const botonSuma = document.querySelectorAll('#items .btn-info')
    const botonRest = document.querySelectorAll('#items .btn-danger')

    botonSuma.forEach(btn => {
        btn.addEventListener('click', () => {
            carrito[btn.dataset.id].cantidad ++
            pintarCarrito()
        })
    })

    botonRest.forEach(btn => {
        btn.addEventListener('click', () => {
            carrito[btn.dataset.id].cantidad --
            if(carrito[btn.dataset.id].cantidad === 0) {
                delete carrito[btn.dataset.id]
            }
            pintarCarrito()
        })
    })

}
