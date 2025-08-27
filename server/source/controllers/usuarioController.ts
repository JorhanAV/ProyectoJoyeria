import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient, Rol, Usuario } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import passport from "passport";
import { generateToken } from "../config/authUtils";

export class UsuarioController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todas las resenas incluyendo el usuario, 
      const usuario = await this.prisma.usuario.findMany({
        
      });
      response.json(usuario);
    } catch (error) {
      next(error);
    }
  };
  //Obtener por Id
  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      let idUsuario = parseInt(request.params.id);
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: idUsuario },
        select: {
          id: true,
          nombre_usuario: true,
          correo: true,
          contraseña: false, // No devolver la contraseña
          rol: true,
        },
      });
      response.json(usuario);
    } catch (error: any) {
      next(error);
    }
  };
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nombre_usuario, correo, contraseña, rol } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(contraseña, salt);

      const user = await this.prisma.usuario.create({
        data: {
          nombre_usuario,
          correo,
          contraseña: hash,
          rol: Rol[rol as keyof typeof Rol],
        },
      });

      res.status(201).json({
        success: true,
        message: "Usuario creado",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (
        err: Error | null,
        user: Express.User | false | null,
        info: { message?: string }
      ) => {
        if (err) return next(err);
        if (!user) {
          return res
            .status(401)
            .json({ success: false, message: info.message });
        }
        const token = generateToken(user as Usuario);
        return res.json({
          success: true,
          message: "Inicio de sesión exitoso",
          token,
        });
      }
    )(req, res, next);
  };
  userAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = req.user as Usuario;
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idUsuario = parseInt(req.params.id);
      const { nombre_usuario, correo } = req.body;

      const usuarioExistente = await this.prisma.usuario.findUnique({
        where: { id: idUsuario },
      });

      
      const usuarioActualizado = await this.prisma.usuario.update({
        where: { id: idUsuario },
        data: {
          nombre_usuario,
          correo,
        },
        select: {
          id: true,
          nombre_usuario: true,
          correo: true,
          rol: true,
        },
      });

      res.json({
        success: true,
        message: "Perfil actualizado",
        data: usuarioActualizado,
      });
    } catch (error) {
      next(error);
    }
  };
}
