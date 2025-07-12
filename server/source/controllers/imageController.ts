import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import uploadFile from "../middleware/ImageConfig";

const __basedir = path.resolve();
const baseUrl = "http://localhost:3000/";
const directoryPath = path.join(__basedir, "/assets/uploads/");
export class ImageController {
  upload = (request: Request, response: Response, next: NextFunction) => {
  uploadFile(request, response, (err: any) => {
    if (err) {
      console.error('Error al subir imagen:', err);
      return response.status(500).send({ message: 'Error al subir imagen.' });
    }

    const files = request.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return response.status(400).send({ message: "¡Por favor sube al menos una imagen!" });
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
}
