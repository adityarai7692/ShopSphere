import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const login = async(req:Request, res:Response)=>{
    try {
        const {email,password}= req.body;
        const result = await loginUser({
            email,
            password
        })
        res.status(200).json({
            success:true,
            message:"Login Successfull",
            data : result
        })
    } catch (error) {
        res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
    }
}


