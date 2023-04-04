import { createContext, useState, useEffect } from "react";
import { Producto, ProductsResponse } from "../interfaces/appInterfaces";
import cafeApi from "../api/cafeApi";
import { ImagePickerResponse } from "react-native-image-picker";

type ProductsContextProps = {
    products: Producto[],
    loadProducts: () => Promise<void>,
    addProduct: ( categoryId:string, productName: string )=>Promise<Producto>,
    updateProduct: ( categoryId:string, productName: string, productId: string )=>Promise<void>,
    deleteProduct: ( id:string )=>Promise<void>,
    loadProductById: (id: string) => Promise<Producto>,
    uploadImage: (data:any, id:string ) => Promise<void> // TODO: cambiar any
}

export const ProductsContext = createContext({} as ProductsContextProps);




export const ProductsProvider = ({ children }: any) => { 

    const [products, setProducts] = useState<Producto[]>([])

    useEffect(() => {// se ejecuta por primera vez
        loadProducts();
    }, [])
    

    const loadProducts = async () => {
        const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
        // setProducts([...products, ...resp.data.productos])
        setProducts([...resp.data.productos])
    }

    const addProduct = async (categoryId:string, productName:string):Promise<Producto>=> {
        
        const resp = await cafeApi.post<Producto>('/productos', {
            nombre: productName,
            categoria: categoryId
        }); 
        setProducts([...products, resp.data]);

        return resp.data;
    }

    const updateProduct = async ( categoryId:string, productName:string, productId:string)=> {
        const resp = await cafeApi.put<Producto>('/productos/'+productId, {
            nombre: productName,
            categoria: categoryId
        }); 
        setProducts(products.map( producto => { return (producto._id === productId ? resp.data : producto) }));
    }

    const deleteProduct = async ()=> {
    
    }

    const loadProductById = async (id:string):Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`productos/${id}`);
        return resp.data
    }
    
    // TODO: cambiar any
    const uploadImage = async ( data:ImagePickerResponse, id:string)=> {
        
        const fileToUpload = {
            uri: data.assets && data.assets[0].uri,
            type: data.assets && data.assets[0].type,
            name: data.assets && data.assets[0].fileName
        }

        const formData = new FormData();

        formData.append("archivo", fileToUpload);

        try {
            const response = await cafeApi.put(`/uploads/productos/${id}`, formData)
            console.log(response);
        } catch (error) {
            console.log(error);
        }

    }
    
    

    return (
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage,
        }}>
            { children }
        </ProductsContext.Provider>
    )
}


/**
 * // CONFIGURACION MINIMA NECESARIA
    import { createContext } from "react";

    export const ProductsContext = createContext({});

    export const ProductsProvider = ({ children }:any) => { 
        return (
            <ProductsContext.Provider value={{

            }}>
                { children }
            </ProductsContext.Provider>
        )
    }

    LUEGO IMPLEMENTAMOS EN EL APP
 */