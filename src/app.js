import express from 'express';
import ProductManager from './ProductManager.js'

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }))


//raiz
app.get('/', (req, res) => {
  res.send('Welcome');
})

//busqueda producto mediante req.query con límite de resultados. Ejemplo :'http://localhost:8080/products?limit=2'

app.get('/products', (req, res) => {
  let limit = parseInt(req.query.limit)
  try {
    if (!limit || limit === null) {
      res.send(ProductManager.getProducts())
    } else {
      const arr = ProductManager.getProducts()
      const arr2 = arr.slice(null, limit) //copia arr
      res.json(arr2)
    }
  } catch (error) {
    res.send('List of products not found')
  }

})

 //Busqueda producto por req.params e id. Ejemplo:'http://localhost:8080/products/4'
  app.get('/products/:pid', async (req, res) => {
    
    let  pid  = parseInt(req.params.pid)
    const product = await ProductManager.getProductById(pid)
    /* const result =  product.find(products => products.pid === pid) */
    
   if(product) {
    return res.send (product) 
    }else{
      return res.send('Product not found')
    } 
   
    
  })



//Sí se ingresa un endpoint diferente a los especificados anteriormente
app.get('*', (req, res) => {
  res.send('404|Page not found')
})


app.listen(port, () => {
  console.log(`Listenign on port http://localhost:${port}`)
});



