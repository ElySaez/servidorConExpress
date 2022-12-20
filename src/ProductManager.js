import fs from'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
        fs.existsSync(this.path) ? this.objs = JSON.parse(fs.readFileSync(this.path, 'utf-8')) : this.objs = [];
    
    }

    getProducts() {
        return this.objs;
    }


    async addProduct(title, description, price, thumbnail, code, stock) {
        let product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        //campos vacios
        for (const key in product) {
            if (Object.hasOwnProperty.call(product, key)) {
                const e = product[key];
                if (!e) {
                    console.log(`El producto ${title} tiene el siguiente problema: ${key}:${e}`);
                    return;
                }
            }
        }
        //existe code
        for (let i = 0; i < this.objs.length; i++) {
            const element = this.objs[i];
            if (element.code == code) {
                console.log(`El code ${code} ya existe, por favor, ingresa otro code para el producto ${title}`);
                return;
            }
        }
        //valida id
        if (this.objs.length === 0) {
            product['id'] = 1
        } else {
            product['id'] = this.objs[this.objs.length - 1]['id'] + 1
        }
        this.objs.push(product)



        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.objs, null, '\t'))
            console.log('Producto guardado')
        } catch (error) {
            console.log('Error al guardar:', error)
        }
    }


    getProductById(id) {
        let obj = this.objs.find(o => o.id === id);
        if (obj) {
            console.log("----------------------------");
            console.log(obj);
        } else {
            console.log("Producto no encontrado");
        }
        return obj;

    }

    async deleteProduct(id) {
        try {
            const obj = this.objs.findIndex((elm) => elm.id === id)
            if (obj !== -1) {
                this.objs.splice(obj, 1)
                await fs.promises.writeFile(this.path, JSON.stringify(this.objs, null, '\t'))
                console.log('Producto eliminado')
            } else {
                console.log('No existe producto')
            }
        } catch (error) {
            console.log('Error al eliminar id', error)
        }
    }

    async update(id, element) {
        try {
            const oldElement = this.objs.find((element) => element.id === id)
            const index = this.objs.findIndex((elemento) => elemento.id === id)

            if (index !== -1) {
                const newElement = { ...oldElement, ...element }
                this.objs[index] = newElement
                await fs.promises.writeFile(this.path, JSON.stringify(this.objs, null, '\t'))
                console.log('Producto actualizado')
            }
        } catch (error) {
            console.log('Error update:', error)
        }
    }

}

const producto = new ProductManager('./products.json')

/* producto.addProduct("manzana", "fruta", 56, "Sin imagen", 88, 40);
producto.addProduct("Libreta", "papeleria", 26, "Sin imagen", 88, 50); //code repetido
producto.addProduct("Agua", "bebida", 30, "Sin imagen", 33, 25);
producto.addProduct("pera", "fruta", 48, "Sin imagen", 59, 60);
producto.addProduct("Melón", "fruta", 25, "Sin imagen", 20); //falta el stock
producto.addProduct("Jabón", "Limpieza", 150, "Sin imagen", 11, 30); */


//producto.getProductById(3) // trae objeto según id indicado a la consola

//console.log(producto.getProducts());//trae productos existentes a la consola

//producto.update(1, { price: 120 }); //modifica el precio

//producto.deleteProduct(4) //Elimina productos según id

export default new ProductManager('./products.json');
