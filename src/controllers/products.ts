import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const getAllProducts = async (req: Request, res:Response)=>{
    try {
        const product = await prisma.product.findMany()
        res.json({message:"Showed All Data Products", data: product})
    } catch (error) {
        res.status(500).json({error: "failed to data product"})
    }
}

export const getProducts = async (req: Request, res:Response)=>{
    const { sortBy, order, minPrice, maxPrice, limit, offset }
        = req.query;

    const filters:any = {};
        if(minPrice) filters.price = {
            gte:parseFloat(minPrice as string)};
        if(maxPrice){
            filters.price ={
                ...(filters.price || {}),
                lte: parseFloat(maxPrice as string)
            }}
    try {
        const products = await prisma.product.findMany({
            where:filters,
            orderBy:{
                [sortBy as string]: order as "asc" | "desc"
            },
            take: Number(limit),
            skip: Number(offset),
        });
        const total = await prisma.product.count({ where: filters })
        res.json({message: "Filterd Data Products", data: products, page:total})
    } catch (error) {
        res.status(500).json({error: "failed to fecth data"})
    }
}

export const createProduct = async (req: Request, res:Response)=>{
    try {
        const{ name, price } = req.body
        const product = await prisma.product.create({
            data:{name, price:parseFloat(price)},
        })
        // res.status(201).json(product)
        res.status(201).json({ message: "Added New Product", data: product })
        
    } catch (error) {
        res.status(500).json({error: "failed to create product"})
    }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, price } = req.body

    const data: any = {}

    if (name !== undefined) data.name = name
    if (price !== undefined) data.price = Number(price)

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data,
    })
    res.status(200).json({
      message: "Updated Data Product",
      data: product,
    })

    if (Object.keys(data).length === 0) {
    return res.status(400).json({
        message: "No data provided to update",
    })
    }

  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error instanceof Error ? error.message : error,
    })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedProduct = await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: "Product deleted",
      data: deletedProduct
    });

  } catch (error: any) {

    // jika id tidak ditemukan
    res.status(404).json({
      success: false,
      message: "Product not found",
      detail: error.message
    });
  }
};
