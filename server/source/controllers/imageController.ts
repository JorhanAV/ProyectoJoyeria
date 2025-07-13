import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import uploadFile from "../middleware/ImageConfig";
import { PrismaClient } from "../../generated/prisma";

const __basedir = path.resolve();
const baseUrl = "http://localhost:3000/";
const directoryPath = path.join(__basedir, "/assets/uploads/");
export class ImageController {
  prisma = new PrismaClient();

  upload = (request: Request, response: Response, next: NextFunction) => {
    uploadFile(request, response, (err: any) => {
      if (err) {
        console.error("Error al subir imagen:", err);
        return response.status(500).send({ message: "Error al subir imagen." });
      }

      const files = request.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return response
          .status(400)
          .send({ message: "¡Por favor sube al menos una imagen!" });
      }

      const fileInfos = files.map((file) => ({
        message: "Archivo subido exitosamente",
        fileName: file.filename,
      }));

      response.status(200).send(fileInfos);
    });
  };

  getListFiles = (
    request: Request,
    response: Response,
    next: NextFunction
  ): void => {
    try {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          response.status(500).send({
            message: "¡No se pueden escanear los archivos!",
          });
          return;
        }
        const fileInfos = files.map((file) => ({
          name: file,
          url: baseUrl + file,
        }));
        response.status(200).send(fileInfos);
      });
    } catch (error: any) {
      next(error);
    }
  };

  download = (
    request: Request,
    response: Response,
    next: NextFunction
  ): void => {
    try {
      const fileName = request.params.name;
      const directoryPath = path.join(__basedir, "/assets/uploads//");
      response.download(path.join(directoryPath, fileName), fileName, (err) => {
        if (err) {
          response.status(500).send({
            message: "No se pudo descargar el archivo. " + err,
          });
        }
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateFile = (request: Request, response: Response, next: NextFunction) => {
    uploadFile(request, response, async (err: any) => {
      try {
        const productoId = Number(request.params.id || request.body.productoId);
        const archivosSubidos = request.files as Express.Multer.File[];
        const imagenesAEliminar = request.body.imagenesAEliminar;

        // 🔥 1. Eliminar imágenes indicadas
        if (imagenesAEliminar) {
          const nombres = Array.isArray(imagenesAEliminar)
            ? imagenesAEliminar
            : [imagenesAEliminar];

          for (const nombre of nombres) {
            const ruta = path.join(directoryPath, nombre);
            if (fs.existsSync(ruta)) {
              fs.unlinkSync(ruta);
              console.log(`Imagen eliminada: ${nombre}`);
            }
          }

          await this.prisma.imagenProducto.deleteMany({
            where: {
              producto_id: productoId,
              url: { in: nombres },
            },
          });
        }

        console.log(archivosSubidos);
        // 📥 2. Guardar nuevas imágenes en la BD
        if (archivosSubidos.length > 0) {
          const nuevas = archivosSubidos.map((file) => ({
            url: file.filename,
            producto_id: productoId,
          }));

          await this.prisma.imagenProducto.createMany({ data: nuevas });
        }

        // 📦 3. Recuperar estado final
        const imagenesFinales = await this.prisma.imagenProducto.findMany({
          where: { producto_id: productoId },
        });

        return response.status(200).json({
          mensaje: "Actualización de imágenes completada",
          nuevasImagenes: archivosSubidos.map((f) => f.filename),
          imagenesEliminadas: imagenesAEliminar || [],
          imagenesActuales: imagenesFinales,
        });
      } catch (error) {
        console.error("Error en updateFile:", error);
        response
          .status(500)
          .json({ mensaje: "Error al actualizar las imágenes." });
      }
    });
  };
}
